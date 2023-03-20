// the different states in which an object can be
export enum ETransformState {
  // data is the result of unpacking
  UNPACKED = "UNPACKED",
  // data can be packed
  PACKABLE = "PACKABLE",
  // the generic data used everywhere
  GENERIC = "GENERIC",
  // data when it needs to be within a form
  INPUTREADY = "INPUTREADY",
}

// a transformer has to implement a set of functions to be usable
export type TTransformer<GUnpacked, GPackable, GGeneric, GInputReady> = {
  // use to identify if the branch of a tree is a transformer or an object
  // which requires nested transformations
  __transformer: "__transformer"
  // the list of transformations the transformer must implement
  inUnpackedOutGeneric: (input: GUnpacked) => GGeneric
  inGenericOutInputready: (input: GGeneric) => GInputReady
  inInputreadyOutGeneric: (input: GInputReady) => GGeneric
  inGenericOutPackable: (input: GGeneric) => GPackable
  // we omit generic -> unpacked since we don't need it for now
  // inGenericOutUnpacked: (input: GGeneric) => GUnpacked
}

// the type definition for an object transformation definition
export type TObjectTransformerDefinition<GObject> = {
  fields: {
    [key in keyof GObject]:
      | TTransformer<any, any, any, any>
      | TObjectTransformerDefinition<any>
  }
  properties?: Record<ETransformState, string>
}

// typedef for the generic transformation function
export type TTransformFn<GInput, GOutput> = (
  input: GInput,
  transformationDefinition: TObjectTransformerDefinition<GInput>,
  inputState: ETransformState,
  outputState: ETransformState
) => GOutput
