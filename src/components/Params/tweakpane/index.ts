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
        if (
          // you cannot update the step of a number controller so we need to re-init the input
          // fixable with custom number control plugin
          // @ts-ignore
          controller.sliderController.baseStep_ !== definition.options?.step ||
          controller.sliderController.props.get("minValue") !==
            definition.options?.min ||
          controller.sliderController.props.get("maxValue") !==
            definition.options.max
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

export function consolidateParamValues(
  params: FxParamDefinition<any>[],
  data?: ParameterValueMap
) {
  return params.reduce((acc, paramDefinition) => {
    const { type, id } = paramDefinition
    const { controller } = parameterControlsDefinition[type as EParameterType]
    const value =
      typeof data?.[id] !== "undefined"
        ? (data as ParameterValueMap)?.[id]
        : controller.parseValue(paramDefinition.default)
    acc[id] = value
    return acc
  }, data || ({} as ParameterValueMap))
}

export function createFxPane(
  container: HTMLElement,
  params: FxParamDefinition<any>[],
  p?: Pane,
  v?: ParameterValueMap
): [Pane, ParameterValueMap] {
  const pane = p || new Pane({ container })
  pane.registerPlugin(StringInputPlugin)
  const valueMap = consolidateParamValues(params, v)
  params.forEach((paramDefinition) => {
    const { id } = paramDefinition
    const { controller } =
      parameterControlsDefinition[paramDefinition.type as EParameterType]
    const inputBinding = pane.children.find(
      (input) =>
        (input as InputBindingApi<any, any>).controller_.binding.target.key ===
        id
    ) as InputBindingApi<any, any>
    if (!inputBinding) {
      pane.addInput(valueMap, id, {
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
    const coldBinding = !params
      .map((p) => p.id)
      .includes(
        (input as InputBindingApi<any, any>).controller_.binding.target.key
      )
    if (coldBinding) pane.remove(input)
  })
  return [pane, valueMap]
}
