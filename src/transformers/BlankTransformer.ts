import { TTransformer } from "./Transformer"

export const DateTransformer: TTransformer<any, any, any, any> = {
  __transformer: "__transformer",
  inUnpackedOutGeneric: (input) => input,
  inGenericOutInputready: (input) => input,
  inInputreadyOutGeneric: (input) => input,
  inGenericOutPackable: (input) => input,
}