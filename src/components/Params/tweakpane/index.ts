import * as StringInputPlugin from "./plugins/StringInputPlugin/index"
import { Pane, BladeApi } from "tweakpane"
import { FxParamDefinition, FxParamOptionsMap } from "../types"
import {
  BladeController,
  InputBindingApi,
  SliderTextController,
  View,
} from "@tweakpane/core"
import { FxStringInputController } from "./plugins/StringInputPlugin/controller"

export type ParameterDefinitions = Record<string, FxParamDefinition<any>>

enum EParameterType {
  string = "string",
  number = "number",
  color = "color",
  boolean = "boolean",
  select = "select",
}

enum EParameterControllerView {
  color = "color",
  string = "string",
  number = "number",
  boolean = "boolean",
}

interface IParameterController {
  view: EParameterControllerView
  parseValue: (v: string) => any
  updateBinding?: (
    binding: InputBindingApi<any, any>,
    definiton: FxParamDefinition<any>,
    p?: Pane,
    v?: ParameterValueMap
  ) => void
}

interface IParameterControlDefinition {
  type: EParameterType
  controller: IParameterController
}

export const parameterControlsDefinition: Record<
  EParameterType,
  IParameterControlDefinition
> = {
  [EParameterType.color]: {
    type: EParameterType.color,
    controller: {
      view: EParameterControllerView.color,
      parseValue: (v: string) => String(v),
    },
  },
  [EParameterType.string]: {
    type: EParameterType.string,
    controller: {
      view: EParameterControllerView.string,
      parseValue: (v: string) => String(v),
      updateBinding: (binding, definition) => {
        const controller = binding.controller_
          .valueController as FxStringInputController
        controller.props.set("minLength", definition.options?.minLength)
        controller.props.set("maxLength", definition.options?.maxLength)
      },
    },
  },
  [EParameterType.number]: {
    type: EParameterType.number,
    controller: {
      view: EParameterControllerView.string,
      parseValue: (v: string) => Number(v),
      updateBinding: (binding, definition, p, v) => {
        if (!p || !v) return
        const controller = binding.controller_
          .valueController as SliderTextController
        // you cannot update the step of a number controller so we need to re-init the input
        // @ts-ignore
        if (
          controller.sliderController.baseStep_ !== definition.options?.step
        ) {
          const index = p.children.findIndex(
            (input) =>
              (input as InputBindingApi<any, any>).controller_.binding.target
                .key === definition.id
          )
          p.remove(binding)
          p.addInput(v!, definition.id, {
            view: EParameterControllerView.string,
            label: definition.name,
            index,
            ...definition.options,
          })
        } else {
          const { min, max } = definition?.options
          controller.sliderController.props.set(
            "minValue",
            definition.options?.min
          )
          controller.sliderController.props.set(
            "maxValue",
            definition.options?.max
          )
          if (v[definition.id] > max) {
            v[definition.id] = max
            binding.refresh()
          } else if (v[definition.id] < min) {
            v[definition.id] = min
            binding.refresh()
          }
        }
      },
    },
  },
  [EParameterType.boolean]: {
    type: EParameterType.boolean,
    controller: {
      view: EParameterControllerView.boolean,
      parseValue: (v: string) => (v === "false" ? false : true),
    },
  },
  [EParameterType.select]: {
    type: EParameterType.select,
    controller: {
      view: EParameterControllerView.string,
      parseValue: (v: string) => String(v),
    },
  },
}

export type ParameterValueMap = Record<string, any>

export function createFxPane(
  container: HTMLElement,
  params: ParameterDefinitions,
  p?: Pane,
  v?: ParameterValueMap
): [Pane, ParameterValueMap] {
  const pane = p || new Pane({ container })
  pane.registerPlugin(StringInputPlugin)
  const valueMap = Object.keys(params).reduce((acc, key: string) => {
    const paramDefinition = params[key]
    const { controller } =
      parameterControlsDefinition[paramDefinition.type as EParameterType]
    const value =
      (v as ParameterValueMap)?.[key] ||
      controller.parseValue(params[key].default)
    acc[key] = value
    return acc
  }, v || ({} as ParameterValueMap))
  Object.keys(params).forEach((key: string) => {
    const paramDefinition = params[key]
    if (!paramDefinition) return
    const { controller } =
      parameterControlsDefinition[paramDefinition.type as EParameterType]
    const inputBinding = pane.children.find(
      (input) =>
        (input as InputBindingApi<any, any>).controller_.binding.target.key ===
        key
    ) as InputBindingApi<any, any>
    if (!inputBinding) {
      pane.addInput(valueMap, key, {
        view: controller.view,
        label: paramDefinition.name,
        ...paramDefinition.options,
      })
    } else {
      if (
        inputBinding.controller_.props.get("label") !== paramDefinition.name
      ) {
        inputBinding.controller_.props.set("label", paramDefinition.name)
      }
      controller.updateBinding?.(inputBinding, paramDefinition, p, valueMap)
    }
  })
  pane.children.forEach((input) => {
    const coldBinding = !Object.keys(params).includes(
      (input as InputBindingApi<any, any>).controller_.binding.target.key
    )
    if (coldBinding) pane.remove(input)
  })
  return [pane, valueMap]
}
