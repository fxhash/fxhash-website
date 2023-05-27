import { useMemo, ReactElement } from "react"
import { FxParamDefinition, FxParamType } from "../types"
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

interface FxParamControllerDefiniton<Type extends FxParamType> {
  type: Type
  controller: (props: FxParamControllerProps<Type>) => ReactElement
  handler: FxParamInputChangeHandler
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
  boolean: {
    type: "boolean",
    controller: BooleanController,
    handler: (e) => (e as React.ChangeEvent<HTMLInputElement>).target.checked,
  },
  color: {
    type: "color",
    controller: ColorController,
    handler: (v) => v,
  },
  select: {
    type: "select",
    controller: SelectController,
    handler: (e) => e.target.value,
  },
}

export interface ParameterControllerProps {
  parameter: FxParamDefinition<FxParamType>
  value: any
  onChange: (id: string, value: any) => void
  parsed?:
    | SafeParseError<ControllerDefinitionSchemaType>
    | SafeParseSuccess<ControllerDefinitionSchemaType>
}

export function ParameterController(props: ParameterControllerProps) {
  const { parameter, onChange, parsed } = props

  const parsedDefinition = useMemo(
    () => parsed || validateParameterDefinition(parameter),
    [parameter, parsed]
  )
  const { controller: Controller, handler } = useMemo(
    () => controllerDefinitions[parameter.type],
    [parameter.type]
  )

  const handleChangeParam = (e: any) => {
    const value = handler(e)
    onChange(parameter.id, value)
  }

  if (parsedDefinition && !parsedDefinition.success)
    return (
      <ControllerInvalid
        definition={parameter}
        error={parsedDefinition.error}
      />
    )

  return (
    <Controller
      id={parameter.id}
      label={parameter.name}
      value={props.value}
      onChange={handleChangeParam}
      // TODO: This should be properly casted
      options={parameter.options as any}
    />
  )
}
