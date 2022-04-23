import style from "./StepDistribution.module.scss"
import layout from "../../styles/Layout.module.scss"
import colors from "../../styles/Colors.module.css"
import text from "../../styles/Text.module.css"
import cs from "classnames"
import { StepComponent } from "../../types/Steps"
import { useContext, useEffect, useMemo, useState } from "react"
import { Formik } from "formik"
import * as Yup from "yup"
import { GenTokDistributionForm, GenTokenInformationsForm } from "../../types/Mint"
import { Form } from "../../components/Form/Form"
import { Field } from "../../components/Form/Field"
import { InputText } from "../../components/Input/InputText"
import { Spacing } from "../../components/Layout/Spacing"
import { Checkbox } from "../../components/Input/Checkbox"
import { Button } from "../../components/Button"
import { InputTextUnit } from "../../components/Input/InputTextUnit"
import { UserContext } from "../UserProvider"
import { Collaboration, User, UserType } from "../../types/entities/User"
import { ISplit } from "../../types/entities/Split"
import { InputSplits } from "../../components/Input/InputSplits"
import { transformSplitsSum1000 } from "../../utils/transformers/splits"
import { InputPricing } from "../Input/Pricing"
import { GenTokPricing } from "../../types/entities/GenerativeToken"
import { YupPricingDutchAuction, YupPricingFixed } from "../../utils/yup/price"
import { YupRoyalties } from "../../utils/yup/royalties"
import { cloneDeep } from "@apollo/client/utilities"
import { YupSplits } from "../../utils/yup/splits"
import { FxhashContracts } from "../../types/Contracts"
import { Fieldset } from "../../components/Form/Fieldset"
import { InputReserves } from "../../components/Input/Reserves/InputReserves"
import { LinkIcon } from "../../components/Link/LinkIcon"
import { YupReserves } from "../../utils/yup/reserves"
import { LinkGuide } from "../../components/Link/LinkGuide"


const validation = Yup.object().shape({
  editions: Yup.number()
    .typeError("Valid number plz")
    .min(1, "At least 1 edition")
    .max(10000, "10000 editions max.")
    .required("Required"),
  pricing: Yup.object({
    pricingFixed: Yup.object()
      .when("pricingMethod", {
        is: GenTokPricing.FIXED,
        then: YupPricingFixed,
      }),
    pricingDutchAuction: Yup.object()
      .when("pricingMethod", {
        is: GenTokPricing.DUTCH_AUCTION,
        then: YupPricingDutchAuction(
          1, "At least in 1 hour"
        ),
      })
  }),
  royalties: YupRoyalties,
  splitsPrimary: YupSplits,
  splitsSecondary: YupSplits,
  reserves: YupReserves(),
})

const defaultDistribution = (
  user: User|Collaboration
): GenTokDistributionForm<string> => {
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
      pct: transformSplitsSum1000(collab.collaborators, idx)
    }))
  }

  return {
    pricing: {
      pricingMethod: GenTokPricing.FIXED,
      pricingFixed: {},
      pricingDutchAuction: {
        decrementDuration: "10",
        levels: [
          "50",
          "30",
          "20",
          "10",
          "5"
        ],
      }
    },
    enabled: false,
    splitsPrimary: cloneDeep(splits),
    splitsSecondary: cloneDeep(splits),
    reserves: [],
  }
}

export const StepDistribution: StepComponent = ({ state, onNext }) => {
  const userCtx = useContext(UserContext)
  const user = userCtx.user! as User

  // the object built at this step
  const distribution = useMemo<GenTokDistributionForm<string>>(
    () => state.distribution ?? defaultDistribution(state.collaboration ?? user)
  , [])

  const next = (values: GenTokDistributionForm<string>) => {
    onNext({
      distribution: values,
    })
  }

  return (
    <div className={cs(style.container)}>
      <h5>How will your piece be sold</h5>

      <Spacing size="3x-large"/>

      <span>
        Read more <LinkGuide href="/doc/artist/pricing-your-project" newTab>about pricing your project</LinkGuide>
      </span>
      <Spacing size="3x-large"/>

      <Formik
        initialValues={distribution}
        validationSchema={validation}
        onSubmit={(values) => {
          next(values)
        }}
      >
        {({ values, handleChange, setFieldValue, handleBlur, handleSubmit, errors }) => (
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
                type="text"
                name="editions"
                value={values.editions}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.editions}
              />
            </Field>

            <Field>
              <InputPricing
                value={values.pricing}
                onChange={val => setFieldValue("pricing", val)}
                errors={errors.pricing}
                lockWarning
                collaboration={state.collaboration}
              />
            </Field>

            <Field 
              error={typeof errors.splitsPrimary === "string"
                ? errors.splitsPrimary
                : undefined
              }
            >
              <label>
                Primary Splits
                <small>
                  You can split the proceeds on primary between different addresses
                </small>
              </label>
              <InputSplits
                value={values.splitsPrimary}
                onChange={splits => setFieldValue("splitsPrimary", splits)}
                sharesTransformer={transformSplitsSum1000}
                textShares="Shares (out of 1000)"
                errors={errors.splitsPrimary as any}
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

            <Field
              error={typeof errors.splitsSecondary === "string" 
                ? errors.splitsSecondary
                : undefined
              }
            >
              <label>
                Royalties Splits
                <small>
                  You can also split the proceeds on the secondary (royalties will be divided between the addresses)
                </small>
              </label>
              <InputSplits
                value={values.splitsSecondary}
                onChange={splits => setFieldValue("splitsSecondary", splits)}
                sharesTransformer={transformSplitsSum1000}
                textShares="Shares (out of 1000)"
                errors={errors.splitsSecondary as any}
              >
                {!values.splitsSecondary.find(
                  split => split.address === FxhashContracts.GENTK_V2
                )?(({ addAddress }) => (
                  <div className={cs(style.royalties_last_row)}>
                    <Button
                      type="button"
                      size="very-small"
                      iconComp={<i className="fa-solid fa-plus" aria-hidden/>}
                      onClick={() => {
                        addAddress(FxhashContracts.GENTK_V2)
                      }}
                    >
                      give some royalties to first collector
                    </Button>
                  </div>
                )):undefined}
              </InputSplits>
            </Field>

            <Fieldset
              error={typeof errors.reserves === "string" 
                ? errors.reserves
                : undefined
              }
            >
              <h5>Reserves</h5>
              <span className={cs(text.info)}>
                You can reserve a certain amount of editions using different constraints.<br/>
                We recommend{" "}
                <LinkGuide
                  href="/doc/artist/reserves"
                  newTab
                >
                  reading the article about reserves
                </LinkGuide>
                {" "}to use the feature properly.
              </span>
              <Spacing size="regular"/>
              <InputReserves
                maxSize={parseInt(values.editions ?? "0")}
                value={values.reserves}
                onChange={reserves => setFieldValue("reserves", reserves)}
                errors={errors.reserves as any}
              />
            </Fieldset>

            <Spacing size="3x-large"/>

            <Field className={cs(style.checkbox)}>
              <Checkbox
                name="enabled"
                value={values.enabled!}
                onChange={(_, event) => handleChange(event)}
              >
                Enabled
              </Checkbox>
            </Field>
            <Spacing size="3x-small"/>
            <span className={cs(text.info)} style={{ alignSelf: "flex-start"}}>
              If disabled, collectors cannot mint the token at all. It overrides pricing settings.<br/>
              You will have to enable it manually afterwards.
            </span>

            <Spacing size="3x-large"/>

            <Button
              type="submit"
              iconComp={<i aria-hidden className="fas fa-arrow-right"/>}
              iconSide="right"
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