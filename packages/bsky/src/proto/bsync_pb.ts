// @generated by protoc-gen-es v1.6.0 with parameter "target=ts,import_extension="
// @generated from file bsync.proto (package bsync, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type {
  BinaryReadOptions,
  FieldList,
  JsonReadOptions,
  JsonValue,
  PartialMessage,
  PlainMessage,
} from '@bufbuild/protobuf'
import { Message, proto3 } from '@bufbuild/protobuf'

/**
 * @generated from message bsync.MuteOperation
 */
export class MuteOperation extends Message<MuteOperation> {
  /**
   * @generated from field: string id = 1;
   */
  id = ''

  /**
   * @generated from field: bsync.MuteOperation.Type type = 2;
   */
  type = MuteOperation_Type.UNSPECIFIED

  /**
   * @generated from field: string actor_did = 3;
   */
  actorDid = ''

  /**
   * @generated from field: string subject = 4;
   */
  subject = ''

  constructor(data?: PartialMessage<MuteOperation>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'bsync.MuteOperation'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    {
      no: 2,
      name: 'type',
      kind: 'enum',
      T: proto3.getEnumType(MuteOperation_Type),
    },
    { no: 3, name: 'actor_did', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 4, name: 'subject', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): MuteOperation {
    return new MuteOperation().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): MuteOperation {
    return new MuteOperation().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): MuteOperation {
    return new MuteOperation().fromJsonString(jsonString, options)
  }

  static equals(
    a: MuteOperation | PlainMessage<MuteOperation> | undefined,
    b: MuteOperation | PlainMessage<MuteOperation> | undefined,
  ): boolean {
    return proto3.util.equals(MuteOperation, a, b)
  }
}

/**
 * @generated from enum bsync.MuteOperation.Type
 */
export enum MuteOperation_Type {
  /**
   * @generated from enum value: TYPE_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * @generated from enum value: TYPE_ADD = 1;
   */
  ADD = 1,

  /**
   * @generated from enum value: TYPE_REMOVE = 2;
   */
  REMOVE = 2,

  /**
   * @generated from enum value: TYPE_CLEAR = 3;
   */
  CLEAR = 3,
}
// Retrieve enum metadata with: proto3.getEnumType(MuteOperation_Type)
proto3.util.setEnumType(MuteOperation_Type, 'bsync.MuteOperation.Type', [
  { no: 0, name: 'TYPE_UNSPECIFIED' },
  { no: 1, name: 'TYPE_ADD' },
  { no: 2, name: 'TYPE_REMOVE' },
  { no: 3, name: 'TYPE_CLEAR' },
])

/**
 * @generated from message bsync.AddMuteOperationRequest
 */
export class AddMuteOperationRequest extends Message<AddMuteOperationRequest> {
  /**
   * @generated from field: bsync.MuteOperation.Type type = 1;
   */
  type = MuteOperation_Type.UNSPECIFIED

  /**
   * @generated from field: string actor_did = 2;
   */
  actorDid = ''

  /**
   * @generated from field: string subject = 3;
   */
  subject = ''

  constructor(data?: PartialMessage<AddMuteOperationRequest>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'bsync.AddMuteOperationRequest'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {
      no: 1,
      name: 'type',
      kind: 'enum',
      T: proto3.getEnumType(MuteOperation_Type),
    },
    { no: 2, name: 'actor_did', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 3, name: 'subject', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): AddMuteOperationRequest {
    return new AddMuteOperationRequest().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): AddMuteOperationRequest {
    return new AddMuteOperationRequest().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): AddMuteOperationRequest {
    return new AddMuteOperationRequest().fromJsonString(jsonString, options)
  }

  static equals(
    a:
      | AddMuteOperationRequest
      | PlainMessage<AddMuteOperationRequest>
      | undefined,
    b:
      | AddMuteOperationRequest
      | PlainMessage<AddMuteOperationRequest>
      | undefined,
  ): boolean {
    return proto3.util.equals(AddMuteOperationRequest, a, b)
  }
}

/**
 * @generated from message bsync.AddMuteOperationResponse
 */
export class AddMuteOperationResponse extends Message<AddMuteOperationResponse> {
  /**
   * @generated from field: bsync.MuteOperation operation = 1;
   */
  operation?: MuteOperation

  constructor(data?: PartialMessage<AddMuteOperationResponse>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'bsync.AddMuteOperationResponse'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'operation', kind: 'message', T: MuteOperation },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): AddMuteOperationResponse {
    return new AddMuteOperationResponse().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): AddMuteOperationResponse {
    return new AddMuteOperationResponse().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): AddMuteOperationResponse {
    return new AddMuteOperationResponse().fromJsonString(jsonString, options)
  }

  static equals(
    a:
      | AddMuteOperationResponse
      | PlainMessage<AddMuteOperationResponse>
      | undefined,
    b:
      | AddMuteOperationResponse
      | PlainMessage<AddMuteOperationResponse>
      | undefined,
  ): boolean {
    return proto3.util.equals(AddMuteOperationResponse, a, b)
  }
}

/**
 * @generated from message bsync.ScanMuteOperationsRequest
 */
export class ScanMuteOperationsRequest extends Message<ScanMuteOperationsRequest> {
  /**
   * @generated from field: string cursor = 1;
   */
  cursor = ''

  /**
   * @generated from field: int32 limit = 2;
   */
  limit = 0

  constructor(data?: PartialMessage<ScanMuteOperationsRequest>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'bsync.ScanMuteOperationsRequest'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'cursor', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 2, name: 'limit', kind: 'scalar', T: 5 /* ScalarType.INT32 */ },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): ScanMuteOperationsRequest {
    return new ScanMuteOperationsRequest().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): ScanMuteOperationsRequest {
    return new ScanMuteOperationsRequest().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): ScanMuteOperationsRequest {
    return new ScanMuteOperationsRequest().fromJsonString(jsonString, options)
  }

  static equals(
    a:
      | ScanMuteOperationsRequest
      | PlainMessage<ScanMuteOperationsRequest>
      | undefined,
    b:
      | ScanMuteOperationsRequest
      | PlainMessage<ScanMuteOperationsRequest>
      | undefined,
  ): boolean {
    return proto3.util.equals(ScanMuteOperationsRequest, a, b)
  }
}

/**
 * @generated from message bsync.ScanMuteOperationsResponse
 */
export class ScanMuteOperationsResponse extends Message<ScanMuteOperationsResponse> {
  /**
   * @generated from field: repeated bsync.MuteOperation operations = 1;
   */
  operations: MuteOperation[] = []

  /**
   * @generated from field: string cursor = 2;
   */
  cursor = ''

  constructor(data?: PartialMessage<ScanMuteOperationsResponse>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'bsync.ScanMuteOperationsResponse'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {
      no: 1,
      name: 'operations',
      kind: 'message',
      T: MuteOperation,
      repeated: true,
    },
    { no: 2, name: 'cursor', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): ScanMuteOperationsResponse {
    return new ScanMuteOperationsResponse().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): ScanMuteOperationsResponse {
    return new ScanMuteOperationsResponse().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): ScanMuteOperationsResponse {
    return new ScanMuteOperationsResponse().fromJsonString(jsonString, options)
  }

  static equals(
    a:
      | ScanMuteOperationsResponse
      | PlainMessage<ScanMuteOperationsResponse>
      | undefined,
    b:
      | ScanMuteOperationsResponse
      | PlainMessage<ScanMuteOperationsResponse>
      | undefined,
  ): boolean {
    return proto3.util.equals(ScanMuteOperationsResponse, a, b)
  }
}

/**
 * Ping
 *
 * @generated from message bsync.PingRequest
 */
export class PingRequest extends Message<PingRequest> {
  constructor(data?: PartialMessage<PingRequest>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'bsync.PingRequest'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): PingRequest {
    return new PingRequest().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): PingRequest {
    return new PingRequest().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): PingRequest {
    return new PingRequest().fromJsonString(jsonString, options)
  }

  static equals(
    a: PingRequest | PlainMessage<PingRequest> | undefined,
    b: PingRequest | PlainMessage<PingRequest> | undefined,
  ): boolean {
    return proto3.util.equals(PingRequest, a, b)
  }
}

/**
 * @generated from message bsync.PingResponse
 */
export class PingResponse extends Message<PingResponse> {
  constructor(data?: PartialMessage<PingResponse>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'bsync.PingResponse'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): PingResponse {
    return new PingResponse().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): PingResponse {
    return new PingResponse().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): PingResponse {
    return new PingResponse().fromJsonString(jsonString, options)
  }

  static equals(
    a: PingResponse | PlainMessage<PingResponse> | undefined,
    b: PingResponse | PlainMessage<PingResponse> | undefined,
  ): boolean {
    return proto3.util.equals(PingResponse, a, b)
  }
}
