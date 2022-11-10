import {
  IParameterDefinition,
  ParameterDefinitions,
  ParameterValueMap,
} from "."

export function createParamsValues(
  params: IParameterDefinition[] | undefined,
  filter?: (parameter: unknown, key: string) => boolean
): ParameterValueMap | undefined {
  if (!params) return
  return params.reduce(
    (acc: ParameterValueMap, param: IParameterDefinition) => {
      if (filter?.(param, param.id) || true) {
        acc[param.id] = param.default
      }
      return acc
    },
    {}
  )
}

export function createParameterDictFromList(
  params: IParameterDefinition[]
): ParameterDefinitions {
  return params.reduce((acc, p: IParameterDefinition) => {
    acc[p.id] = p
    return acc
  }, {} as ParameterDefinitions)
}

export const filterParameterDefinitioDict = (
  params: ParameterDefinitions | undefined,
  filter: (parameter: IParameterDefinition, key: string) => boolean
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
