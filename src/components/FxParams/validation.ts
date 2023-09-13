import { SafeParseError, SafeParseSuccess, z } from "zod"
import { FxParamDefinition, FxParamType } from "./types"

const ControllerTypeSchema = z.enum([
  "number",
  "bigint",
  "color",
  "string",
  "bytes",
  "boolean",
  "select",
])

const FxParamOptions_bigintSchema = z.object({
  min: z.coerce.number().or(z.bigint()).optional(),
  max: z.coerce.number().or(z.bigint()).optional(),
})

const FxParamOptions_numberSchema = z.object({
  min: z.coerce.number().gte(Number.MIN_SAFE_INTEGER).optional(),
  max: z.coerce.number().lte(Number.MAX_SAFE_INTEGER).optional(),
  step: z.coerce.number().optional(),
})

const FxParamOptions_stringSchema = z.object({
  minLength: z.coerce.number().gte(0).optional(),
  maxLength: z.coerce.number().optional(),
})

const FxParamOptions_bytesSchema = z.object({
  length: z.coerce.number().gt(0),
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

const BytesControllerSchema = BaseControllerDefinitionSchema.extend({
  type: z.literal(ControllerTypeSchema.enum.bytes),
  options: FxParamOptions_bytesSchema,
  default: z.any().optional(),
  update: z.literal("code-driven", {
    invalid_type_error: "Bytes parameters must be code-driven",
    required_error: "Bytes parameters must be code-driven",
  }),
})

const NumberControllerSchema = BaseControllerDefinitionSchema.extend({
  type: z.literal(ControllerTypeSchema.enum.number),
  options: FxParamOptions_numberSchema.optional(),
  default: z.coerce
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
  BytesControllerSchema,
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
  bytes: BytesControllerSchema,
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
