import assert from 'node:assert'
import EventEmitter, { once } from 'node:events'
import {
  TestNetwork,
  SeedClient,
  basicSeed,
  ModeratorClient,
} from '@atproto/dev-env'
import { ComAtprotoAdminDefs } from '@atproto/api'
import { forSnapshot } from './_util'
import {
  REASONAPPEAL,
  REASONMISLEADING,
  REASONSPAM,
} from '../src/lexicon/types/com/atproto/moderation/defs'

describe('moderation-events', () => {
  let network: TestNetwork
  let sc: SeedClient
  let modClient: ModeratorClient

  const seedEvents = async () => {
    const bobsAccount = {
      $type: 'com.atproto.admin.defs#repoRef',
      did: sc.dids.bob,
    }
    const alicesAccount = {
      $type: 'com.atproto.admin.defs#repoRef',
      did: sc.dids.alice,
    }
    const bobsPost = {
      $type: 'com.atproto.repo.strongRef',
      uri: sc.posts[sc.dids.bob][0].ref.uriStr,
      cid: sc.posts[sc.dids.bob][0].ref.cidStr,
    }
    const alicesPost = {
      $type: 'com.atproto.repo.strongRef',
      uri: sc.posts[sc.dids.alice][0].ref.uriStr,
      cid: sc.posts[sc.dids.alice][0].ref.cidStr,
    }

    for (let i = 0; i < 4; i++) {
      await sc.createReport({
        reasonType: i % 2 ? REASONSPAM : REASONMISLEADING,
        reason: 'X',
        //   Report bob's account by alice and vice versa
        subject: i % 2 ? bobsAccount : alicesAccount,
        reportedBy: i % 2 ? sc.dids.alice : sc.dids.bob,
      })
      await sc.createReport({
        reasonType: REASONSPAM,
        reason: 'X',
        //   Report bob's post by alice and vice versa
        subject: i % 2 ? bobsPost : alicesPost,
        reportedBy: i % 2 ? sc.dids.alice : sc.dids.bob,
      })
    }
  }

  beforeAll(async () => {
    network = await TestNetwork.create({
      dbPostgresSchema: 'ozone_moderation_events',
    })
    sc = network.getSeedClient()
    modClient = network.ozone.getModClient()
    await basicSeed(sc)
    await network.processAll()
    await seedEvents()
  })

  afterAll(async () => {
    await network.close()
  })

  describe('query events', () => {
    it('returns all events for record or repo', async () => {
      const [bobsEvents, alicesPostEvents] = await Promise.all([
        modClient.queryModerationEvents({
          subject: sc.dids.bob,
        }),
        modClient.queryModerationEvents({
          subject: sc.posts[sc.dids.alice][0].ref.uriStr,
        }),
      ])

      expect(forSnapshot(bobsEvents.events)).toMatchSnapshot()
      expect(forSnapshot(alicesPostEvents.events)).toMatchSnapshot()
    })

    it('filters events by types', async () => {
      const alicesAccount = {
        $type: 'com.atproto.admin.defs#repoRef',
        did: sc.dids.alice,
      }
      await Promise.all([
        modClient.emitModerationEvent({
          event: {
            $type: 'com.atproto.admin.defs#modEventComment',
            comment: 'X',
          },
          subject: alicesAccount,
        }),
        modClient.emitModerationEvent({
          event: {
            $type: 'com.atproto.admin.defs#modEventEscalate',
            comment: 'X',
          },
          subject: alicesAccount,
        }),
      ])
      const [allEvents, reportEvents] = await Promise.all([
        modClient.queryModerationEvents({
          subject: sc.dids.alice,
        }),
        modClient.queryModerationEvents({
          subject: sc.dids.alice,
          types: ['com.atproto.admin.defs#modEventReport'],
        }),
      ])

      expect(allEvents.events.length).toBeGreaterThan(
        reportEvents.events.length,
      )
      expect(
        [...new Set(reportEvents.events.map((e) => e.event.$type))].length,
      ).toEqual(1)

      expect(
        [...new Set(allEvents.events.map((e) => e.event.$type))].length,
      ).toEqual(4)
    })

    it('returns events for all content by user', async () => {
      const [forAccount, forPost] = await Promise.all([
        modClient.queryModerationEvents({
          subject: sc.dids.bob,
          includeAllUserRecords: true,
        }),
        modClient.queryModerationEvents({
          subject: sc.posts[sc.dids.bob][0].ref.uriStr,
          includeAllUserRecords: true,
        }),
      ])

      expect(forAccount.events.length).toEqual(forPost.events.length)
      // Save events are returned from both requests
      expect(forPost.events.map(({ id }) => id).sort()).toEqual(
        forAccount.events.map(({ id }) => id).sort(),
      )
    })

    it('returns paginated list of events with cursor', async () => {
      const allEvents = await modClient.queryModerationEvents({
        subject: sc.dids.bob,
        includeAllUserRecords: true,
      })

      const getPaginatedEvents = async (
        sortDirection: 'asc' | 'desc' = 'desc',
      ) => {
        let defaultCursor: undefined | string = undefined
        const events: ComAtprotoAdminDefs.ModEventView[] = []
        let count = 0
        do {
          // get 1 event at a time and check we get all events
          const res = await modClient.queryModerationEvents({
            limit: 1,
            subject: sc.dids.bob,
            includeAllUserRecords: true,
            cursor: defaultCursor,
            sortDirection,
          })
          events.push(...res.events)
          defaultCursor = res.cursor
          count++
          // The count is a circuit breaker to prevent infinite loop in case of failing test
        } while (defaultCursor && count < 10)

        return events
      }

      const defaultEvents = await getPaginatedEvents()
      const reversedEvents = await getPaginatedEvents('asc')

      expect(allEvents.events.length).toEqual(6)
      expect(defaultEvents.length).toEqual(allEvents.events.length)
      expect(reversedEvents.length).toEqual(allEvents.events.length)
      // First event in the reversed list is the last item in the default list
      expect(reversedEvents[0].id).toEqual(
        defaultEvents[defaultEvents.length - 1].id,
      )
    })

    it('returns report events matching reportType filters', async () => {
      const [spamEvents, misleadingEvents] = await Promise.all([
        modClient.queryModerationEvents({
          reportTypes: [REASONSPAM],
        }),
        modClient.queryModerationEvents({
          reportTypes: [REASONMISLEADING, REASONAPPEAL],
        }),
      ])

      expect(misleadingEvents.events.length).toEqual(2)
      expect(spamEvents.events.length).toEqual(6)
    })

    it('returns events matching keyword in comment', async () => {
      const [eventsWithX, eventsWithTest, eventsWithComment] =
        await Promise.all([
          modClient.queryModerationEvents({
            comment: 'X',
          }),
          modClient.queryModerationEvents({
            comment: 'test',
          }),
          modClient.queryModerationEvents({
            hasComment: true,
          }),
        ])

      expect(eventsWithX.events.length).toEqual(10)
      expect(eventsWithTest.events.length).toEqual(0)
      expect(eventsWithComment.events.length).toEqual(10)
    })

    it('returns events matching filter params for labels', async () => {
      const [negatedLabelEvent, createdLabelEvent] = await Promise.all([
        modClient.emitModerationEvent({
          event: {
            $type: 'com.atproto.admin.defs#modEventLabel',
            comment: 'X',
            negateLabelVals: ['L1', 'L2'],
            createLabelVals: [],
          },
          //   Report bob's account by alice and vice versa
          subject: {
            $type: 'com.atproto.admin.defs#repoRef',
            did: sc.dids.alice,
          },
        }),
        modClient.emitModerationEvent({
          event: {
            $type: 'com.atproto.admin.defs#modEventLabel',
            comment: 'X',
            createLabelVals: ['L1', 'L2'],
            negateLabelVals: [],
          },
          //   Report bob's account by alice and vice versa
          subject: {
            $type: 'com.atproto.admin.defs#repoRef',
            did: sc.dids.bob,
          },
        }),
      ])
      const [withTwoLabels, withoutTwoLabels, withOneLabel, withoutOneLabel] =
        await Promise.all([
          modClient.queryModerationEvents({
            addedLabels: ['L1', 'L3'],
          }),
          modClient.queryModerationEvents({
            removedLabels: ['L1', 'L2'],
          }),
          modClient.queryModerationEvents({
            addedLabels: ['L1'],
          }),
          modClient.queryModerationEvents({
            removedLabels: ['L2'],
          }),
        ])

      // Verify that when querying for events where 2 different labels were added
      // events where all of the labels from the list was added are returned
      expect(withTwoLabels.events.length).toEqual(0)
      expect(negatedLabelEvent.id).toEqual(withoutTwoLabels.events[0].id)

      expect(createdLabelEvent.id).toEqual(withOneLabel.events[0].id)
      expect(negatedLabelEvent.id).toEqual(withoutOneLabel.events[0].id)
    })
    it('returns events matching filter params for tags', async () => {
      const tagEvent = async ({
        add,
        remove,
      }: {
        add: string[]
        remove: string[]
      }) =>
        modClient.emitModerationEvent({
          event: {
            $type: 'com.atproto.admin.defs#modEventTag',
            comment: 'X',
            add,
            remove,
          },
          subject: {
            $type: 'com.atproto.admin.defs#repoRef',
            did: sc.dids.carol,
          },
        })
      const addEvent = await tagEvent({ add: ['L1', 'L2'], remove: [] })
      const addAndRemoveEvent = await tagEvent({ add: ['L3'], remove: ['L2'] })
      const [addFinder, addAndRemoveFinder, _removeFinder] = await Promise.all([
        modClient.queryModerationEvents({
          addedTags: ['L1'],
        }),
        modClient.queryModerationEvents({
          addedTags: ['L3'],
          removedTags: ['L2'],
        }),
        modClient.queryModerationEvents({
          removedTags: ['L2'],
        }),
      ])

      expect(addFinder.events.length).toEqual(1)
      expect(addEvent.id).toEqual(addFinder.events[0].id)

      expect(addAndRemoveEvent.id).toEqual(addAndRemoveFinder.events[0].id)
      expect(addAndRemoveEvent.id).toEqual(addAndRemoveFinder.events[0].id)
      expect(addAndRemoveEvent.event.add).toEqual(['L3'])
      expect(addAndRemoveEvent.event.remove).toEqual(['L2'])
    })
  })

  describe('get event', () => {
    it('gets an event by specific id', async () => {
      const data = await modClient.getEvent(1)
      expect(forSnapshot(data)).toMatchSnapshot()
    })
  })

  describe('blobs', () => {
    it('are tracked on takedown event', async () => {
      const post = sc.posts[sc.dids.carol][0]
      assert(post.images.length > 1)
      await modClient.emitModerationEvent({
        event: {
          $type: 'com.atproto.admin.defs#modEventTakedown',
        },
        subject: {
          $type: 'com.atproto.repo.strongRef',
          uri: post.ref.uriStr,
          cid: post.ref.cidStr,
        },
        subjectBlobCids: [post.images[0].image.ref.toString()],
      })
      const result = await modClient.queryModerationEvents({
        subject: post.ref.uriStr,
        types: ['com.atproto.admin.defs#modEventTakedown'],
      })
      expect(result.events[0]).toMatchObject({
        createdBy: network.ozone.moderatorAccnt.did,
        event: {
          $type: 'com.atproto.admin.defs#modEventTakedown',
        },
        subjectBlobCids: [post.images[0].image.ref.toString()],
      })
    })

    it("are tracked on reverse-takedown event even if they aren't specified", async () => {
      const post = sc.posts[sc.dids.carol][0]
      await modClient.emitModerationEvent({
        event: {
          $type: 'com.atproto.admin.defs#modEventReverseTakedown',
        },
        subject: {
          $type: 'com.atproto.repo.strongRef',
          uri: post.ref.uriStr,
          cid: post.ref.cidStr,
        },
      })
      const result = await modClient.queryModerationEvents({
        subject: post.ref.uriStr,
      })
      expect(result.events[0]).toMatchObject({
        createdBy: network.ozone.moderatorAccnt.did,
        event: {
          $type: 'com.atproto.admin.defs#modEventReverseTakedown',
        },
        subjectBlobCids: [post.images[0].image.ref.toString()],
      })
    })
  })

  describe('email event', () => {
    let sendMailOriginal
    const mailCatcher = new EventEmitter()
    const getMailFrom = async (
      promise,
    ): Promise<{ to: string; subject: string; from: string }> => {
      const result = await Promise.all([once(mailCatcher, 'mail'), promise])
      return result[0][0]
    }

    beforeAll(() => {
      const mailer = network.pds.ctx.moderationMailer
      // Catch emails for use in tests
      sendMailOriginal = mailer.transporter.sendMail
      mailer.transporter.sendMail = async (opts) => {
        const result = await sendMailOriginal.call(mailer.transporter, opts)
        mailCatcher.emit('mail', opts)
        return result
      }
    })

    afterAll(() => {
      network.pds.ctx.moderationMailer.transporter.sendMail = sendMailOriginal
    })

    it('sends email via pds.', async () => {
      const mail = await getMailFrom(
        modClient.emitModerationEvent({
          event: {
            $type: 'com.atproto.admin.defs#modEventEmail',
            comment: 'Reaching out to Alice',
            subjectLine: 'Hello',
            content: 'Hey Alice, how are you?',
          },
          subject: {
            $type: 'com.atproto.admin.defs#repoRef',
            did: sc.dids.alice,
          },
        }),
      )
      expect(mail).toEqual({
        to: 'alice@test.com',
        subject: 'Hello',
        html: 'Hey Alice, how are you?',
      })
    })
  })
})
