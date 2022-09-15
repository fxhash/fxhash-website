import style from "./ArticleListEditions.module.scss"
import cs from "classnames"
import { Form, Formik } from "formik"
import { useCallback, useMemo, useState } from "react"
import { NFTArticle } from "../../../types/entities/Article"
import { Ledger } from "../../../types/entities/Ledger"
import { Button } from "../../Button"
import { Field } from "../../Form/Field"
import { SliderWithText } from "../../Input/SliderWithText"
import { SliderWithTextInput } from "../../Input/SliderWithTextInput"
import { Modal } from "../../Utils/Modal"
import { InputTextUnit } from "../../Input/InputTextUnit"
import { Submit } from "../../Form/Submit"
import { Spacing } from "../../Layout/Spacing"
import * as Yup from "yup"
import { YupPrice } from "../../../utils/yup/price"
import { useContractOperation } from "../../../hooks/useContractOperation"
import { ListingV3Operation } from "../../../services/contract-operations/ListingV3"
import { ContractFeedback } from "../../Feedback/ContractFeedback"

interface Props {
  ledger: Ledger
  article: NFTArticle
}
export function ArticleListEditions({
  ledger,
  article,
}: Props) {
  const [showModal, setShowModal] = useState(false)

  const validation = useMemo(() => {
    return Yup.object({
      amount: Yup.number()
        .typeError("Valid number plz")
        .required("Required")
        .min(1, "Min 1")
        .max(ledger.amount, `Max ${ledger.amount}`),
      price: YupPrice,
    })
  }, [ledger])

  const {
    call,
    loading,
    success,
    error,
    state
  } = useContractOperation(ListingV3Operation)

  const list = useCallback((amount: string, price: string) => {
    call({
      article: article,
      owner: ledger.owner,
      amount: amount,
      price: ((price as any) * 1000000).toString(),
    })
  }, [article, ledger])

  return (
    <>
      <Button
        type="button"
        size="very-small"
        color="secondary"
        onClick={() => setShowModal(true)}
      >
        list
      </Button>

      {showModal && (
        <Modal
          title={`List editions of ${article.title}`}
          onClose={() => setShowModal(false)}
        >
          <Formik
            initialValues={{
              amount: "1",
              price: "0"
            }}
            onSubmit={(values) => {
              list(values.amount, values.price)
            }}
            validationSchema={validation}
          >
            {({ values, setFieldValue, errors }) => (
              <Form
                className={cs(style.modal_content)}
              >
                <Field error={errors?.amount}>
                  <label htmlFor="editions">
                    Editions for sale
                    <small>The number of editions which will be listed, [1; {ledger.amount}]</small>
                  </label>
                  <SliderWithTextInput
                    value={values.amount as any}
                    onChange={val => setFieldValue("amount", val)}
                    min={1}
                    max={ledger.amount}
                    step={1}
                    textTransform={v => v as any}
                    unit="editions"
                  />
                </Field>

                <Field error={errors?.price}>
                  <label htmlFor="price">
                    Price
                  </label>
                  <InputTextUnit
                    unit="tez"
                    type="text"
                    name="price"
                    value={values?.price ?? ""}
                    onChange={evt => setFieldValue("price", evt.target.value)}
                    // onBlur={onBlur}
                    // error={!!errors?.price}
                  />
                </Field>

                <Spacing size="2x-large"/>

                <Submit layout="center-vertical">
                  <ContractFeedback
                    state={state}
                    error={error}
                    success={success}
                    loading={loading}
                    successMessage="Listing successful !"
                  />

                  <Button
                    type="submit"
                    color="secondary"
                    size="regular"
                    state={loading ? "loading" : "default"}
                    disabled={loading}
                  >
                    list editions
                  </Button>
                </Submit>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
    </>
  )
}