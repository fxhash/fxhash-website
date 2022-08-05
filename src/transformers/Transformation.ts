import { ETransformState, TObjectTransformerDefinition, TTransformer, TTransformFn } from "./Transformer"


/**
 * Transforms some input data (which has a given type) into some other data
 * (which also has a given type). The definition dictates how the properties of
 * the input object should be mutated.
 * @param input the data to transform, must match some data expected for the
 * given input state
 * @param transformationDefinition the definition of the transformation, maps
 * the keys of the input to transformers
 * @param inputState state of the input
 * @param outputState expected state
 */
export function transform<GInput>(
  input: GInput,
  transformationDefinition: TObjectTransformerDefinition<GInput>,
  inputState: ETransformState,
  outputState: ETransformState
) {
  const transformation: any = {}

  // // loop through each property of the definition
  // for (const key in transformationDefinition) {
  //   // first we look for undefined / null values and pass those as is
  //   if (input[key] == null) {
  //     transformation[key] = input[key]
  //     continue
  //   }
  //   // if the definition value is a transformation definition, recursive
  //   if (typeof transformationDefinition[key].__transformer === "undefined") {
  //     transformation[key] = transform(
  //       input[key],
  //       transformationDefinition[key] as TObjectTransformerDefinition<any>,
  //       inputState,
  //       outputState
  //     )
  //     continue
  //   }
  //   // at this point definition *must be* a transformer
  //   const transformer = transformationDefinition[key] as TTransformer<
  //     any, any, any
  //   >

  //   // otherwise we apply the transformation on the property
  //   if (inputState === ETransformState.UNPACKED) {
  //     if (outputState === ETransformState.GENERIC) {
  //       transformation[key] = transformer.inUnpackedOutGeneric(
  //         input[key]
  //       )
  //     }
  //     else if (outputState === ETransformState.INPUTREADY) {
  //       transformation[key] = transformer.inGenericOutInputready(
  //         transformer.inUnpackedOutGeneric(input[key])
  //       )
  //     }
  //   }
  //   else if (inputState === ETransformState.GENERIC) {
  //     if (outputState === ETransformState.INPUTREADY) {
  //       transformation[key] = transformer.inGenericOutInputready(
  //         input[key]
  //       )
  //     }
  //     else {
  //       throw new Error("Transformation GENERIC -> UNPACKED not implemented")
  //     }
  //   }
  //   else if (inputState === ETransformState.INPUTREADY) {
  //     if (outputState === ETransformState.GENERIC) {
  //       transformation[key] = transformer.inInputreadyOutGeneric(
  //         input[key]
  //       )
  //     }
  //     else {
  //       throw new Error("Transformation INPUTREADY -> UNPACKED not implemented")
  //     }
  //   }
  // }

  return transformation
}