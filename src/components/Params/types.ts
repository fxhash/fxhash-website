export type FxParamType = "number" | "boolean" | "color" | "string" | "select"

interface FxParamOption_number {
  min?: string
  max?: string
  step?: string
}

interface FxParamOption_string {
  minLength?: string
  maxLength?: string
}

interface FxParamOption_select {
  options: string[]
}

export interface FxParamOptionsMap {
  number: FxParamOption_number
  boolean: undefined
  color: undefined
  string: FxParamOption_string
  select: FxParamOption_select
}

export interface FxParamDefinition<Type extends FxParamType> {
  id: string
  name?: string
  type: Type
  default: string
  options?: FxParamOptionsMap[Type]
  exposedAsFeature?: string
}

export interface FxParamTypeMap {
  number: number
  boolean: boolean
  color: string
  string: string
  select: string
}

export interface FxParamProcessor<Type extends FxParamType> {
  serialize: (
    input: FxParamTypeMap[Type],
    definition: FxParamDefinition<Type>
  ) => string
  deserialize: (
    input: string,
    definition: FxParamDefinition<Type>
  ) => FxParamTypeMap[Type]
  bytesLength: (options: FxParamOptionsMap[Type]) => number
}

export type FxParamProcessors = {
  [T in FxParamType]: FxParamProcessor<T>
}
