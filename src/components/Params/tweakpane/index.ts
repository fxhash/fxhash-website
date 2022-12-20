import * as StringInputPlugin from "./plugins/StringInputPlugin/index"
import { Pane } from "tweakpane"

export interface IParameterDefinition {
  // the name of the parameter, will be exposed externally
  name: string
  // the type of the parameter, among a list of allowed parameter
  type: string
  // the parameter ID, will be used as a key for the object accessible in the code
  // it is also used to reference this parameter in the presets
  id: string
  // the default value for this parameter
  default: string
  // optional options for the parameter, depends on the parameter type
  options?: Record<string, any>
  // is the preset exposed as a feature ?
  // default: false
  // exposed parameters will be added at the end of the features object automatically
  // when the code is executed
  exposedAsFeature?: boolean
}

export type ParameterDefinitions = Record<string, IParameterDefinition>

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
      parseValue: (v: string) => `#${v}`,
    },
  },
  [EParameterType.string]: {
    type: EParameterType.string,
    controller: {
      view: EParameterControllerView.string,
      parseValue: (v: string) => String(v),
    },
  },
  [EParameterType.number]: {
    type: EParameterType.number,
    controller: {
      view: EParameterControllerView.string,
      parseValue: (v: string) => Number(v),
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

export type ParameterValueMap = Record<string, unknown>

export function createFxPane(
  container: HTMLElement,
  params: ParameterDefinitions
): [Pane, ParameterValueMap] {
  const pane = new Pane({ container })
  pane.registerPlugin(StringInputPlugin)
  const valueMap = Object.keys(params).reduce((acc, key: string) => {
    const paramDefinition = params[key]
    const { controller } =
      parameterControlsDefinition[paramDefinition.type as EParameterType]
    acc[key] = controller.parseValue(params[key].default)
    return acc
  }, {} as ParameterValueMap)
  Object.keys(params).map((key: string) => {
    const paramDefinition = params[key]
    if (!paramDefinition) return
    const { controller } =
      parameterControlsDefinition[paramDefinition.type as EParameterType]
    pane.addInput(valueMap, key, {
      view: controller.view,
      label: paramDefinition.name,
      ...paramDefinition.options,
    })
  })
  return [pane, valueMap]
}
