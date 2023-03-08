import React, { memo, useMemo } from "react"
import { Button } from "../Button"
import { MintTicket } from "../../types/entities/MintTicket"
import { DisplayTezos } from "../Display/DisplayTezos"
import { Modal } from "../Utils/Modal"
import { InputTextUnit } from "../Input/InputTextUnit"
import style from "./MintTicketModal.module.scss"
import colors from "../../styles/Colors.module.css"
import cs from "classnames"
import * as Yup from "yup"
import { YupPrice } from "../../utils/yup/price"
import { useFormik } from "formik"
import { Spacing } from "../Layout/Spacing"
import { Error } from "../Error/Error"
import { getMintTicketHarbergerTax } from "../../utils/math"

const validation = Yup.object({
  price: YupPrice,
  days: YupPrice,
})

interface ModalClaimMintTicketProps {
  mintTicket: MintTicket
  onClose: () => void
}

const _ModalClaimMintTicket = ({
  mintTicket,
  onClose,
}: ModalClaimMintTicketProps) => {
  const { handleChange, handleBlur, values, errors } = useFormik({
    initialValues: {
      price: mintTicket.price / 1000000,
      days: 7,
    },
    onSubmit: () => {
      console.log("submit")
    },
    validationSchema: validation,
  })
  const harbergerTax = useMemo(() => {
    if (values.price > 0 && values.days > 0) {
      return getMintTicketHarbergerTax(values.price, values.days)
    }
    return false
  }, [values.price, values.days])
  const totalToPay = useMemo(() => {
    return (harbergerTax || 0) * 1000000 + mintTicket.price
  }, [harbergerTax, mintTicket.price])
  return (
    <Modal
      title={`Claim mint pass for “${mintTicket.token?.name}”`}
      onClose={onClose}
    >
      <p className={style.p}>
        Before purchasing this mint pass, you must define the price at witch it
        will appear next, as well the days during which you want to hold the
        asset. If you are going to use this pass less then 24 hours after your
        purchase, the tax will fully be reimbursed.
      </p>
      <Spacing size="regular" />
      <div className={style.container_inputs}>
        <div className={style.field}>
          <div className={style.container_input}>
            <label htmlFor="price">
              <div className={style.label_title}>price</div>
              <div className={style.label_subtitle}>
                Anyone paying this price can claim your pass at any time
              </div>
            </label>
            <InputTextUnit
              error={!!errors.price}
              name="price"
              value={values.price}
              onChange={handleChange}
              onBlur={handleBlur}
              classNameContainer={style.input}
              sizeX="small"
              unit="tez"
              id="price"
            />
          </div>
          {errors.price && (
            <Error className={style.error}>{errors.price}</Error>
          )}
        </div>
        <div className={style.field}>
          <div className={style.container_input}>
            <label htmlFor="days">
              <div className={style.label_title}>days covered by your tax</div>
              <div className={style.label_subtitle}>
                For how long do you want your token to be secured at this price?
                Not including the gracing period.
              </div>
            </label>
            <InputTextUnit
              name="days"
              classNameContainer={style.input}
              value={values.days}
              onChange={handleChange}
              onBlur={handleBlur}
              sizeX="small"
              unit="days"
              id="days"
            />
          </div>
          {errors.days && <Error className={style.error}>{errors.days}</Error>}
        </div>
      </div>
      <hr className={style.hr} />
      <div className={style.row_with_unit}>
        <div className={style.row_label}>Current price</div>
        <div className={style.unit}>
          <DisplayTezos
            mutez={mintTicket.price}
            formatBig={false}
            tezosSize="regular"
          />
        </div>
      </div>
      <div className={style.row_with_unit}>
        <div className={style.row_label}>Harberger tax</div>
        <div className={style.unit}>
          {harbergerTax ? (
            <DisplayTezos
              mutez={harbergerTax * 1000000}
              formatBig={false}
              tezosSize="regular"
            />
          ) : (
            "x"
          )}
        </div>
      </div>
      <div className={style.row_with_unit}>
        <div className={cs(style.row_label, colors.black)}>Total</div>
        <div className={style.unit}>
          <DisplayTezos
            mutez={totalToPay}
            formatBig={false}
            tezosSize="regular"
          />
        </div>
      </div>
      <div className={style.container_buttons}>
        <Button type="button" color="secondary" size="small">
          purchase mint ticket{" "}
          <DisplayTezos
            mutez={totalToPay}
            formatBig={false}
            tezosSize="regular"
          />
        </Button>
      </div>
    </Modal>
  )
}

export const ModalClaimMintTicket = memo(_ModalClaimMintTicket)
