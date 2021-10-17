import style from "./StepInformations.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { StepComponent } from "../../types/Steps"
import { Formik } from "formik"
import { GenerativeTokenMetadata } from "../../types/Metadata"
import { GenTokenInformationsForm } from "../../types/Mint"
import * as Yup from "yup"
import { Form } from "../../components/Form/Form"
import { Field } from "../../components/Form/Field"
import { InputText } from "../../components/Input/InputText"
import { Spacing } from "../../components/Layout/Spacing"
import { InputTextarea } from "../../components/Input/InputTextarea"
import { Fieldset } from "../../components/Form/Fieldset"
import { Checkbox } from "../../components/Input/Checkbox"
import { Button } from "../../components/Button"
import { InputTextUnit } from "../../components/Input/InputTextUnit"


const initialForm: Partial<GenTokenInformationsForm> = {
  name: "",
  description: "",
  childrenDescription: "",
  tags: [ "" ],
  editions: undefined,
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
    .max(512, "Max 512 characters")
    .required("Required"),
  childrenDescription: Yup.string()
    .max(512, "Max 512 characters"),
  editions: Yup.number()
    .min(1, "At least 1 edition")
    .max(2500, "2500 editions max.")
    .required("Required"),
  price: Yup.number()
    .positive()
    .when("enabled", {
      is: true,
      then: Yup.number().required("Price is required if token is enabled"),
      otherwise: Yup.number().positive()
    }),
  royalties: Yup.number()
    .when("enabled", {
      is: true,
      then: Yup.number()
        .required("Royalties are required if token is enabled")
        .min(10, "Min 10%")
        .max(25, "Max 25%"),
      otherwise: Yup.number().positive()
        .min(10, "Min 10%")
        .max(25, "Max 25%")
    })
})

export const StepInformations: StepComponent = ({ state, onNext }) => {
  return (
    <div className={cs(style.container)}>
      <h5>Almost done 😮‍💨</h5>

      <Spacing size="3x-large"/>

      <Formik
        initialValues={initialForm}
        enableReinitialize
        validationSchema={validation}
        onSubmit={(values) => {
          // todo
          console.log(values)
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, errors }) => (
          <Form className={cs(layout.smallform, style.form)} onSubmit={handleSubmit}>
            <Field error={errors.name}>
              <label htmlFor="name">
                Name of the piece
                <small> (“ #N” will be added to the collected NFTs)</small>
              </label>
              <InputText
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.name}
              />
            </Field>

            <Field error={errors.description}>
              <label htmlFor="description">
                Generative Token description
              </label>
              <InputTextarea
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.description}
              />
            </Field>

            <Field error={errors.childrenDescription}>
              <label htmlFor="childrenDescription">
                Collected NFTs description
                <small>(leave empty if you want the same as Generative Token)</small>
              </label>
              <InputTextarea
                name="childrenDescription"
                value={values.childrenDescription}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.childrenDescription}
              />
            </Field>

            <Field error={errors.tags}>
              <label htmlFor="tags">
                Tags
                <small>(comma separated)</small>
              </label>
              <InputText
                name="tags"
                value={values.tags?.join(", ")}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.tags}
              />
            </Field>

            <Field error={errors.editions}>
              <label htmlFor="editions">
                Number of editions
                <small>(how many NFT can be generated from your Token)</small>
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

            <Fieldset>
              <Field className={cs(style.checkbox)}>
                <Checkbox
                  name="enabled"
                  value={values.enabled!}
                  onChange={(_, event) => handleChange(event)}
                >
                  Can be collected now
                </Checkbox>
              </Field>

              <Field error={errors.price}>
                <label htmlFor="price">
                  Price
                </label>
                <InputTextUnit
                  unit="tez"
                  type="number"
                  name="price"
                  min={0}
                  value={values.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.price}
                />
              </Field>

              <Field error={errors.royalties}>
                <label htmlFor="royalties">
                  Royalties
                  <small>in %, between 10 and 25</small>
                </label>
                <InputTextUnit
                  unit="%"
                  type="number"
                  name="royalties"
                  min={0}
                  value={values.royalties}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.royalties}
                />
              </Field>

              <small>you will be able to change those 3 fields after the token will be minted</small>
            </Fieldset>

            <Spacing size="3x-large"/>

            <Button
              type="submit"
              color="secondary"
              // iconComp={<i aria-hidden className="fas fa-arrow-right"/>}
              // iconSide="right"
              size="large"
              disabled={Object.keys(errors).length > 0}
              // state={loading ? "loading" : "default"}
              // onClick={sendData}
            >
              Mint Token
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