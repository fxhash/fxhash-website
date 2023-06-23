export type FxParamType =
  | "number"
  | "bigint"
  | "boolean"
  | "color"
  | "string"
  | "select"

interface FxParamOption_bigint {
  min?: number | bigint
  max?: number | bigint
}

interface FxParamOption_number {
  min?: number
  max?: number
  step?: number
}

interface FxParamOption_string {
  minLength?: number
  maxLength?: number
}

interface FxParamOption_select {
  options: string[]
}

export interface FxParamOptionsMap {
  number: FxParamOption_number
  bigint: FxParamOption_bigint
  boolean: undefined
  color: undefined
  string: FxParamOption_string
  select: FxParamOption_select
}

export interface FxParamTypeMap {
  number: number
  bigint: bigint
  boolean: boolean
  color: string
  string: string
  select: string
}

export type FxParamUpdateMode = "page-reload" | "sync" | "code-driven"

export interface FxParamDefinition<Type extends FxParamType> {
  id: string
  name?: string
  type: Type
  update?: FxParamUpdateMode
  default: FxParamTypeMap[Type]
  value: FxParamTypeMap[Type]
  options: FxParamOptionsMap[Type]
  version?: string
}

export type FxParamDefinitions = FxParamDefinition<FxParamType>[]

export type hexString = `#${string}`

export interface FxParamProcessor<Type extends FxParamType> {
  serialize: (
    input: FxParamTypeMap[Type],
    definition: FxParamDefinition<Type>
  ) => string
  deserialize: (
    input: string,
    definition: FxParamDefinition<Type>
  ) => FxParamTypeMap[Type]
  bytesLength: (definition: FxParamDefinition<Type>) => number
  transform?: (input: string) => any
  random: (definition: FxParamDefinition<Type>) => FxParamTypeMap[Type]
}

export type FxParamProcessors = {
  [T in FxParamType]: FxParamProcessor<T>
}

export type FxParamsData = Record<string, any>
