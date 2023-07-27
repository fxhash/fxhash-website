export type FxParamType =
  | "number"
  | "bigint"
  | "boolean"
  | "color"
  | "string"
  | "bytes"
  | "select"

export type FxParamOptionsMap = {
  [Type in FxParamType]: {
    number: {
      min?: number
      max?: number
      step?: number
    }
    bigint: {
      min?: number | bigint
      max?: number | bigint
    }
    boolean: undefined
    color: undefined
    string: {
      minLength?: number
      maxLength?: number
    }
    bytes: {
      length: number
    }
    select: {
      options: string[]
    }
  }[Type]
}

export type FxParamTypeMap = {
  [Type in FxParamType]: {
    number: number
    bigint: bigint
    boolean: boolean
    color: string
    string: string
    bytes: Uint8Array
    select: string
  }[Type]
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
