import style from "./StepDistribution.module.scss"
import layout from "../../styles/Layout.module.scss"
import colors from "../../styles/Colors.module.css"
import cs from "classnames"
import { StepComponent } from "../../types/Steps"
import { useContext, useEffect, useState } from "react"
import { Formik } from "formik"
import * as Yup from "yup"
import useFetch, { CachePolicies } from "use-http"
import { MetadataError, MetadataResponse } from "../../types/Responses"
import { CaptureSettings, GenerativeTokenMetadata } from "../../types/Metadata"
import { CaptureMode, CaptureTriggerMode, GenTokDistributionForm, GenTokenInformationsForm } from "../../types/Mint"
import { Form } from "../../components/Form/Form"
import { Field } from "../../components/Form/Field"
import { InputText } from "../../components/Input/InputText"
import { Spacing } from "../../components/Layout/Spacing"
import { InputTextarea } from "../../components/Input/InputTextarea"
import { Fieldset } from "../../components/Form/Fieldset"
import { Checkbox } from "../../components/Input/Checkbox"
import { Button } from "../../components/Button"
import { InputTextUnit } from "../../components/Input/InputTextUnit"
import { getIpfsSlash } from "../../utils/ipfs"
import { UserContext } from "../UserProvider"
import { useContractCall } from "../../utils/hookts"
import { MintGenerativeCallData } from "../../types/ContractCalls"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import { getMutezDecimalsNb, isPositive } from "../../utils/math"
import { tagsFromString } from "../../utils/strings"
import { stringToByteString } from "../../utils/convert"
import { Collaboration, User, UserType } from "../../types/entities/User"
import { ISplit } from "../../types/entities/Split"
import { InputSplits } from "../../components/Input/InputSplits"
import { transformSplitsSum1000 } from "../../utils/transformers/splits"
import { InputPricing } from "../Input/Pricing"


const initialForm: Partial<GenTokenInformationsForm> = {
  name: "",
  description: "",
  childrenDescription: "",
  tags: "",
  editions: 1,
  enabled: false,
  price: undefined,
  royalties: undefined
}

const validation = Yup.object().shape({
  name: Yup.string()
    .min(3, "Min 3 characters")
    .max(42, "Max 42 characters")
    .required("Required"),
  description: Yup.string()
    .max(4096, "Max 4096 characters")
    .required("Required"),
  childrenDescription: Yup.string()
    .max(4096, "Max 4096 characters"),
  editions: Yup.number()
    .min(1, "At least 1 edition")
    .max(10000, "10000 editions max.")
    .required("Required"),
  price: Yup.number()
    .when("enabled", {
      is: true,
      then: Yup.number()
        .typeError("Valid number plz")
        .required("Price is required if token is enabled")
        .test(
          "positive",
          `Price must be >= ${parseFloat(process.env.NEXT_PUBLIC_GT_MIN_PRICE!)}`,
          isPositive
        ),
      otherwise: Yup.number()
        .typeError("Valid number plz")
        .test(
          "positive",
          `Price must be >= ${parseFloat(process.env.NEXT_PUBLIC_GT_MIN_PRICE!)}`,
          isPositive
        )
    }),
  royalties: Yup.number()
    .when("enabled", {
      is: true,
      then: Yup.number()
        .typeError("Valid number plz")
        .required("Royalties are required if token is enabled")
        .min(10, "Min 10%")
        .max(25, "Max 25%"),
      otherwise: Yup.number()
        .typeError("Valid number plz")
        .min(10, "Min 10%")
        .max(25, "Max 25%")
    })
})

const defaultDistribution = (user: User|Collaboration): GenTokDistributionForm => {
  let splits: ISplit[] = []

  // if user is single, we create a simple split
  if (user.type === UserType.REGULAR) {
    splits = [{
      address: user.id,
      pct: 1000,
    }]
  }
  // but if it's a collab
  else if ((user as Collaboration).collaborators) {
    const collab = user as Collaboration
    splits = collab.collaborators.map((user, idx) => ({
      address: user.id,
      pct: transformSplitsSum1000(collab.collaborators.length, idx)
    }))
  }

  return {
    pricing: {},
    enabled: false,
    splitsPrimary: [...splits],
    splitsSecondary: [...splits]
  }
}

export const StepDistribution: StepComponent = ({ state, onNext }) => {
  const userCtx = useContext(UserContext)
  const user = userCtx.user! as User

  console.log(user)

  console.log(state)

  // the object built at this step
  const [distribution, setDistribution] = useState<GenTokDistributionForm>(
    state.distribution ?? defaultDistribution(state.collaboration ?? user)
  )

  console.log(distribution)

  const update = (key: keyof GenTokDistributionForm, value: any) => {
    setDistribution({
      ...distribution,
      [key]: value,
    })
  }

  const uploadInformations = (formInformations: GenTokenInformationsForm) => {
    
  }

  return (
    <div className={cs(style.container)}>
      <h5>How will your piece be sold</h5>

      <Spacing size="3x-large"/>

      <Formik
        initialValues={initialForm}
        validationSchema={validation}
        onSubmit={(values) => {
          uploadInformations(values as GenTokenInformationsForm)
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, errors }) => (
          <Form 
            className={cs(layout.smallform, style.form)} 
            onSubmit={handleSubmit}
          >
            
            <em className={cs(colors.gray)}>
              You will be able to edit these settings after the publication, except if stated otherwise on the corresponding fields.
            </em>

            <Spacing size="3x-large"/>

            <Field error={errors.editions}>
              <label htmlFor="editions">
                Number of editions
                <small>how many NFT can be generated using your Token - <strong>can only be decreased after publication</strong></small>
              </label>
              <InputText
                type="number"
                name="editions"
                value={values.editions}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.editions}
              />
            </Field>

            <Field>
              <InputPricing/>
            </Field>

            <Field error={errors.price}>
              <label htmlFor="price">
                Price
              </label>
              <InputTextUnit
                unit="tez"
                type="text"
                name="price"
                value={values.price||""}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.price}
              />
            </Field>

            <Field>
              <label>
                Primary Splits
                <small>
                  You can split the proceeds on primary between different addresses
                </small>
              </label>
              <InputSplits
                value={distribution.splitsPrimary}
                onChange={splits => update("splitsPrimary", splits)}
                sharesTransformer={transformSplitsSum1000}
                textShares="Shares (out of 1000)"
              />
            </Field>

            <Field error={errors.royalties}>
              <label htmlFor="royalties">
                Royalties
                <small>in %, between 10 and 25</small>
              </label>
              <InputTextUnit
                unit="%"
                type="text"
                name="royalties"
                value={values.royalties||""}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.royalties}
              />
            </Field>

            <Field>
              <label>
                Royalties Splits
                <small>
                  You can also split the proceeds on the secondary (royalties will be divided between the addresses)
                </small>
              </label>
              <InputSplits
                value={distribution.splitsSecondary}
                onChange={splits => update("splitsSecondary", splits)}
                sharesTransformer={transformSplitsSum1000}
                textShares="Shares (out of 1000)"
              />
            </Field>

            <Field className={cs(style.checkbox)}>
              <Checkbox
                name="enabled"
                value={values.enabled!}
                onChange={(_, event) => handleChange(event)}
              >
                Enabled
              </Checkbox>
            </Field>
            <em className={cs(colors.gray)} style={{ alignSelf: "flex-start"}}>
              If disabled, collectors cannot mint the token at all.<br/>
              You will have to enable it manually afterwards.
            </em>

            <Spacing size="3x-large"/>

            <Button
              type="submit"
              color="secondary"
              size="large"
              disabled={Object.keys(errors).length > 0}
            >
              next step
            </Button>
          </Form>
        )}
      </Formik>

      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>
    </div>
  )
}