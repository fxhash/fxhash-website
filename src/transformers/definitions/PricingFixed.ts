import { IPricingFixed } from "../../types/entities/Pricing"
import { DateTransformer } from "../DateTransformer"
import { MutezTransformer } from "../MutezTransformer"
import { TObjectTransformerDefinition } from "../Transformer"

export const PricingFixedTransformDefinition: TObjectTransformerDefinition<IPricingFixed> =
  {
    fields: {
      price: MutezTransformer,
      opensAt: DateTransformer,
    },
    // properties: {

    // }
  }

// todo: write the Transformation function
// todo: test on small sections of the app to see how it integrates
// todo: need another state ? variables name not the same :(
// todo: maybe have a dictionnary of the transformation to make on properties ?
