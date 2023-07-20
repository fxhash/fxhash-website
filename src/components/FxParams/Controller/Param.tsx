import { useMemo, ReactElement, createElement } from "react"
import {
  FxParamDefinition,
  FxParamOptionsMap,
  FxParamType,
  FxParamTypeMap,
} from "../types"
import { FxParamInputChangeHandler, FxParamControllerProps } from "./Controller"
import { BooleanController } from "./Boolean"
import { ColorController } from "./Color"
import { NumberController } from "./Number"
import { BigIntController } from "./BigInt"
import { SelectController } from "./Select"
import { StringController } from "./String"
import {
  validateParameterDefinition,
  ControllerDefinitionSchemaType,
} from "../validation"
import { SafeParseError, SafeParseSuccess, z } from "zod"
import { ControllerInvalid } from "./Invalid"
import { BytesController } from "./Bytes"

interface FxParamControllerDefiniton<Type extends FxParamType> {
  type: Type
  controller: (props: FxParamControllerProps<Type>) => ReactElement
  handler: FxParamInputChangeHandler<Type>
}

export type FxParamControllerDefinitions = {
  [T in FxParamType]: FxParamControllerDefiniton<T>
}

export const controllerDefinitions: FxParamControllerDefinitions = {
  number: {
    type: "number",
    controller: NumberController,
    handler: (e) => Number(e.target.value),
  },
  bigint: {
    type: "bigint",
    controller: BigIntController,
    handler: (e) => BigInt(e.target.value),
  },
  string: {
    type: "string",
    controller: StringController,
    handler: (e) => e.target.value,
  },
  bytes: {
    type: "bytes",
    controller: BytesController,
    handler: (e) => e.target.value,
  },
  boolean: {
    type: "boolean",
    controller: BooleanController,
    handler: (e) => (e as React.ChangeEvent<HTMLInputElement>).target.checked,
  },
  color: {
    type: "color",
    controller: ColorController,
    handler: (v) => v.replace("#", ""),
  },
  select: {
    type: "select",
    controller: SelectController,
    handler: (e) => e.target.value,
  },
}

export interface ParameterControllerProps<Type extends FxParamType> {
  definition: FxParamDefinition<Type>
  value: FxParamTypeMap[Type]
  onChange: (value: FxParamTypeMap[Type]) => void
  parsed?:
    | SafeParseError<ControllerDefinitionSchemaType>
    | SafeParseSuccess<ControllerDefinitionSchemaType>
  forceEnabled?: boolean
}

export function ParameterController<Type extends FxParamType>(
  props: ParameterControllerProps<Type>
) {
  const { definition, value, onChange, parsed, forceEnabled } = props

  const parsedDefinition = useMemo(
    () => parsed || validateParameterDefinition(definition),
    [definition, parsed]
  )
  const { controller: Controller, handler } = useMemo(
    () => controllerDefinitions[definition.type],
    [definition.type]
  )

  const handleChangeParam = (e: any) => {
    const value = handler(e)
    onChange(value as FxParamTypeMap[Type])
  }

  if (parsedDefinition && !parsedDefinition.success)
    return (
      <ControllerInvalid
        definition={definition}
        error={parsedDefinition.error}
      />
    )

  const options = definition.options as
    | FxParamOptionsMap["number"]
    | FxParamOptionsMap["string"]
    | FxParamOptionsMap["bigint"]
    | FxParamOptionsMap["select"]
    | undefined

  const isCodeDriven = definition.update === "code-driven" && !forceEnabled

  return createElement(
    Controller as React.FC<
      FxParamControllerProps<any> & {
        options: typeof options
      }
    >,
    {
      id: definition.id,
      label: definition.name,
      value: value as any,
      onChange: handleChangeParam,
      options,
      isCodeDriven,
    }
  )
}
