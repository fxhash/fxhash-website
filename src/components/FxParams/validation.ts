import { SafeParseError, SafeParseSuccess, z } from "zod"
import { FxParamDefinition, FxParamType } from "./types"

const ControllerTypeSchema = z.enum([
  "number",
  "bigint",
  "color",
  "string",
  "boolean",
  "select",
])

const FxParamOptions_bigintSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
})

const FxParamOptions_numberSchema = z.object({
  min: z.number().gte(Number.MIN_SAFE_INTEGER).optional(),
  max: z.number().lte(Number.MAX_SAFE_INTEGER).optional(),
  step: z.number().optional(),
})

const FxParamOptions_stringSchema = z.object({
  minLength: z.number().gte(0).optional(),
  maxLength: z.number().lte(64).optional(),
})

const FxParamOptions_selectSchema = z.object({
  options: z.string().array().nonempty(),
})

export const BaseControllerDefinitionSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  exposedAsFeature: z.boolean().optional(),
})

const StringControllerSchema = BaseControllerDefinitionSchema.extend({
  type: z.literal(ControllerTypeSchema.enum.string),
  options: FxParamOptions_stringSchema.optional(),
  default: z.string().optional(),
})

const NumberControllerSchema = BaseControllerDefinitionSchema.extend({
  type: z.literal(ControllerTypeSchema.enum.number),
  options: FxParamOptions_numberSchema.optional(),
  default: z
    .number()
    .gte(Number.MIN_SAFE_INTEGER)
    .lte(Number.MAX_SAFE_INTEGER)
    .optional(),
})

const BigIntControllerSchema = BaseControllerDefinitionSchema.extend({
  type: z.literal(ControllerTypeSchema.enum.bigint),
  options: FxParamOptions_bigintSchema.optional(),
  default: z.bigint().optional(),
})

const SelectControllerSchema = BaseControllerDefinitionSchema.extend({
  type: z.literal(ControllerTypeSchema.enum.select),
  options: FxParamOptions_selectSchema,
  default: z.string().optional(),
})

const BooleanControllerSchema = BaseControllerDefinitionSchema.extend({
  type: z.literal(ControllerTypeSchema.enum.boolean),
  options: z.undefined(),
  default: z.boolean().optional(),
})

const ColorControllerSchema = BaseControllerDefinitionSchema.extend({
  type: z.literal(ControllerTypeSchema.enum.color),
  options: z.undefined(),
  default: z.string().optional(),
})

const ControllerDefinitionSchema = z.union([
  StringControllerSchema,
  NumberControllerSchema,
  BigIntControllerSchema,
  SelectControllerSchema,
  BooleanControllerSchema,
  ColorControllerSchema,
])

export type ControllerDefinitionSchemaType = z.infer<
  typeof ControllerDefinitionSchema
>

const controllerSchema = {
  number: NumberControllerSchema,
  bigint: BigIntControllerSchema,
  color: ColorControllerSchema,
  string: StringControllerSchema,
  boolean: BooleanControllerSchema,
  select: SelectControllerSchema,
}

export function validateParameterDefinition(
  parameterDefinition: FxParamDefinition<FxParamType>
):
  | SafeParseError<ControllerDefinitionSchemaType>
  | SafeParseSuccess<ControllerDefinitionSchemaType>
  | undefined {
  return controllerSchema[parameterDefinition.type]?.safeParse(
    parameterDefinition
  )
}

