import { ParameterDefinitions, ParameterValueMap } from "."
import { FxParamDefinition } from "../types"

export function createParamsValues(
  params: FxParamDefinition<any>[] | undefined,
  filter?: (parameter: unknown, key: string) => boolean
): ParameterValueMap | undefined {
  if (!params) return
  return params.reduce(
    (acc: ParameterValueMap, param: FxParamDefinition<any>) => {
      if (filter?.(param, param.id) || true) {
        acc[param.id] = param.default
      }
      return acc
    },
    {}
  )
}

export function createParameterDictFromList(
  params: FxParamDefinition<any>[]
): ParameterDefinitions {
  return params.reduce((acc, p: FxParamDefinition<any>) => {
    acc[p.id] = p
    return acc
  }, {} as ParameterDefinitions)
}

export const filterParameterDefinitioDict = (
  params: ParameterDefinitions | undefined,
  filter: (parameter: FxParamDefinition<any>, key: string) => boolean
): ParameterDefinitions | undefined => {
  if (!params) return
  const paramsCopy = JSON.parse(JSON.stringify(params))
  return Object.keys(paramsCopy).reduce(
    (acc: ParameterDefinitions, key: string) => {
      if (filter(paramsCopy[key], key)) {
        acc[key] = paramsCopy[key]
      }
      return acc
    },
    {}
  )
}
