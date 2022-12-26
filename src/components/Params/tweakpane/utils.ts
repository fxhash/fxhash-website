import { ParameterValueMap } from "."
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
