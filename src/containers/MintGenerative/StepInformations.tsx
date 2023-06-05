import style from "./StepInformations.module.scss"
import layout from "../../styles/Layout.module.scss"
import colors from "../../styles/Colors.module.css"
import cs from "classnames"
import { StepComponent } from "../../types/Steps"
import { useContext, useEffect, useMemo, useState } from "react"
import { Formik } from "formik"
import * as Yup from "yup"
import { GenTokenInformationsForm } from "../../types/Mint"
import { Form } from "../../components/Form/Form"
import { Field } from "../../components/Form/Field"
import { InputText } from "../../components/Input/InputText"
import { Spacing } from "../../components/Layout/Spacing"
import { InputTextarea } from "../../components/Input/InputTextarea"
import { Button } from "../../components/Button"
import {
  InputMultiList,
  MultiListItem,
} from "../../components/Input/InputMultiList"
import { genTokLabelDefinitions } from "../../utils/generative-token"

const initialForm: GenTokenInformationsForm = {
  name: "",
  description: "",
  childrenDescription: "",
  mintingInstructions: "",
  tags: "",
  labels: [],
}

const labelsList: MultiListItem[] = Object.keys(genTokLabelDefinitions).map(
  (id) => ({
    value: parseInt(id),
    props: {
      // @ts-ignore
      label: genTokLabelDefinitions[id].label,
    },
  })
)

const validation = Yup.object().shape({
  name: Yup.string()
    .min(3, "Min 3 characters")
    .max(42, "Max 42 characters")
    .required("Required"),
  description: Yup.string()
    .max(4096, "Max 4096 characters")
    .required("Required"),
  childrenDescription: Yup.string().max(4096, "Max 4096 characters"),
})

export const StepInformations: StepComponent = ({ state, onNext }) => {
  const usesParams = !!state.previewInputBytes
  const initialState = useMemo(() => state.informations || initialForm, [])

  const next = (values: GenTokenInformationsForm) => {
    onNext({
      informations: values,
    })
  }

  return (
    <div className={cs(style.container)}>
      <h4>Project details</h4>

      <Spacing size="3x-large" sm="x-large" />

      <Formik
        initialValues={initialState}
        validationSchema={validation}
        onSubmit={(values) => {
          next(values)
        }}
      >
        {({
          values,
          handleChange,
          setFieldValue,
          handleBlur,
          handleSubmit,
          errors,
        }) => (
          <Form
            className={cs(layout.smallform, style.form)}
            onSubmit={handleSubmit}
          >
            <Field error={errors.name}>
              <label htmlFor="name">
                Name of the piece
                <small>“ #N” will be added to the collected NFTs</small>
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
              <label htmlFor="description">Generative Token description</label>
              <InputTextarea
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.description}
              />
            </Field>

            {usesParams && (
              <Field>
                <label htmlFor="mintingInstructions">
                  Minting instructions
                  <small>
                    Detailed minting instructions for complex params or custom
                    minting interface use cases
                  </small>
                </label>
                <InputTextarea
                  name="mintingInstructions"
                  value={values.mintingInstructions}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.mintingInstructions}
                />
              </Field>
            )}

            <Field error={errors.childrenDescription}>
              <label htmlFor="childrenDescription">
                Collected NFTs description
                <small>
                  Leave empty if you want the same as Generative Token
                </small>
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
                <small>
                  Comma-separated values (used to enhance search results)
                </small>
              </label>
              <InputText
                name="tags"
                value={values.tags}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.tags}
              />
            </Field>

            <Field>
              <label>
                Labels
                <small>Can be edited by the moderators at any time</small>
              </label>
              <InputMultiList
                listItems={labelsList}
                selected={values.labels || []}
                onChangeSelected={(n) => setFieldValue("labels", n)}
                className={cs(style.labels_container)}
              >
                {({ itemProps }) => (
                  <span className={cs(style.label)}>{itemProps.label}</span>
                )}
              </InputMultiList>
            </Field>

            <Spacing size="3x-large" sm="x-large" />

            <Button
              type="submit"
              color="secondary"
              iconComp={<i aria-hidden className="fas fa-arrow-right" />}
              iconSide="right"
              size="large"
              className={style.button}
              disabled={Object.keys(errors).length > 0}
            >
              final preview
            </Button>
          </Form>
        )}
      </Formik>

      <Spacing size="3x-large" />
      <Spacing size="3x-large" sm="none" />
      <Spacing size="3x-large" sm="none" />
    </div>
  )
}
