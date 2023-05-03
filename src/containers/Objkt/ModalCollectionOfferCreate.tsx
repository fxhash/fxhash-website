import React, { memo, useCallback, useMemo } from "react"
import { Modal } from "../../components/Utils/Modal"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import style from "./ModalCollectionOfferCreate.module.scss"
import { InputTextUnit } from "../../components/Input/InputTextUnit"
import { IconTezos } from "../../components/Icons/IconTezos"
import { Button } from "../../components/Button"
import { useContractOperation } from "../../hooks/useContractOperation"
import { CollectionOfferOperation } from "../../services/contract-operations/CollectionOffer"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Spacing } from "../../components/Layout/Spacing"
import { plural } from "../../utils/strings"
import { DisplayTezos } from "../../components/Display/DisplayTezos"
import { Error } from "../../components/Error/Error"
import { YupPrice } from "../../utils/yup/price"

const floors = [
  { label: "Floor", percent: 100 },
  { label: "75%", percent: 75 },
  { label: "50%", percent: 50 },
  { label: "25%", percent: 25 },
]
interface ModalCollectionOfferCreateProps {
  token: GenerativeToken
  floor?: number | null
  onClose: () => void
}
const _ModalCollectionOfferCreate = ({
  token,
  floor,
  onClose,
}: ModalCollectionOfferCreateProps) => {
  const {
    state,
    loading: contractLoading,
    error: contractError,
    success,
    call,
  } = useContractOperation(CollectionOfferOperation)

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    setFieldValue,
  } = useFormik({
    initialValues: {
      amount: 1,
      price: 0,
    },
    onSubmit: (submittedValues) => {
      const singleOfferPrice = Math.floor(submittedValues.price * 1000000)
      const amount = submittedValues.amount
      call({
        token,
        amount,
        price: singleOfferPrice,
      })
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .typeError("Valid number plz")
        .required("Required")
        .min(1, "At least one")
        .max(token.supply, `Max ${token.supply}`),
      price: YupPrice,
    }),
  })

  const normalizedFloor = useMemo(() => (floor || 0) / 1000000, [floor])
  const handleSetPriceUsingFloor = useCallback(
    (percent) => () => {
      setFieldValue("price", normalizedFloor * (percent / 100))
    },
    [normalizedFloor, setFieldValue]
  )

  const totalToPay = useMemo(() => {
    return values.amount && values.price
      ? values.amount * values.price * 1000000
      : 0
  }, [values.amount, values.price])

  const hasErrors = Object.keys(errors).length > 0
  return (
    <Modal
      title={`Make a collection offer for “${token.name}“`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <Spacing size="none" sm="regular" />
        <div className={style.container_field}>
          <span>I want to buy</span>
          <InputTextUnit
            error={!!errors.amount}
            type="number"
            name="amount"
            unit={`edition${plural(values.amount || 0)}`}
            sizeX="small"
            value={values.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            min={1}
            step={1}
            className={style.input_amount}
          />
        </div>
        {errors.amount && (
          <Error className={style.error}>{errors.amount}</Error>
        )}
        <Spacing size="regular" />
        <div className={style.container_field_price}>
          <span>for</span>
          <InputTextUnit
            error={!!errors.price}
            type="number"
            name="price"
            unit={<IconTezos size="regular" />}
            positionUnit="inside-left"
            sizeX="small"
            value={values.price}
            onChange={handleChange}
            onBlur={handleBlur}
            min={0}
            lang="en"
            step="any"
          />
          {floor && (
            <div className={style.container_floor}>
              {floors.map(({ percent, label }) => (
                <Button
                  type="button"
                  color="white"
                  size="custom"
                  className={style.button_floor}
                  key={label}
                  onClick={handleSetPriceUsingFloor(percent)}
                >
                  {label}
                </Button>
              ))}
            </div>
          )}
        </div>
        {errors.price && <Error className={style.error}>{errors.price}</Error>}
        <Spacing size="x-large" />
        <div className={style.container_buttons}>
          <Button
            type="submit"
            state={contractLoading ? "loading" : "default"}
            color="secondary"
            size="regular"
            classNameChildren={style.button_listing_children}
            disabled={!values.price || hasErrors}
          >
            <i aria-hidden className="fa-solid fa-rectangle-history" />
            make collection offer
            {totalToPay && !hasErrors ? (
              <span>
                {" ("}
                <DisplayTezos
                  mutez={totalToPay}
                  formatBig={false}
                  tezosSize="regular"
                />
                )
              </span>
            ) : (
              ""
            )}
          </Button>
          <ContractFeedback
            state={state}
            loading={contractLoading}
            success={success}
            error={contractError}
            successMessage="Your collection offer has been placed"
          />
        </div>
      </form>
    </Modal>
  )
}

export const ModalCollectionOfferCreate = memo(_ModalCollectionOfferCreate)
