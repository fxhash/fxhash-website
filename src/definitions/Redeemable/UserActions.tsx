import { RedeemableUserActionInputAddress } from "components/Form/Redeemable/UserAction/InputAddress"
import { RedeemableUserActionInputEmail } from "components/Form/Redeemable/UserAction/InputEmail"
import { RedeemableUserActionInputList } from "components/Form/Redeemable/UserAction/InputList"
import { FunctionComponent, ReactNode } from "react"
import {
  RedeemableUserActionInputType,
  RedeemableUserActionOptions,
  RedeemableUserActionType,
} from "types/entities/Redeemable"
import { object, SchemaOf, string } from "yup"

export type RedeemableUserActionInputComponent<
  T extends RedeemableUserActionType
> = FunctionComponent<{
  value: RedeemableUserActionInputType[T]
  onChange: (value: RedeemableUserActionInputType[T]) => void
  options: RedeemableUserActionOptions[T]
  error: any
}>

type RedeemableUserActionDefinition<T extends RedeemableUserActionType> = {
  type: T
  input: RedeemableUserActionInputComponent<T>
  validation: SchemaOf<RedeemableUserActionInputType[T]>
  initialValue: () => RedeemableUserActionInputType[T] | null
}

type RedeemableUserActionDefinitions = {
  [T in RedeemableUserActionType]: RedeemableUserActionDefinition<T>
}

export const redeemableUserActionDefinitions: RedeemableUserActionDefinitions =
  {
    [RedeemableUserActionType.INPUT_ADDRESS]: {
      type: RedeemableUserActionType.INPUT_ADDRESS,
      input: RedeemableUserActionInputAddress,
      validation: object()
        .shape({
          firstName: string().required("Required!"),
          lastName: string().required("Required!"),
          address: string().required("Required!"),
          postalCode: string().required("Required!"),
          city: string().required("Required!"),
          state: string(),
          country: string().required("Required!"),
        })
        .required("Required!"),
      initialValue: () => ({
        firstName: "",
        lastName: "",
        address: "",
        postalCode: "",
        city: "",
        state: "",
        country: "",
      }),
    },
    [RedeemableUserActionType.INPUT_EMAIL]: {
      type: RedeemableUserActionType.INPUT_EMAIL,
      input: RedeemableUserActionInputEmail,
      validation: string().email("Invalid email").required("Required!"),
      initialValue: () => "",
    },
    [RedeemableUserActionType.INPUT_LIST]: {
      type: RedeemableUserActionType.INPUT_LIST,
      input: RedeemableUserActionInputList,
      validation: string().typeError("Required!").required("Required!"),
      initialValue: () => null,
    },
  }
