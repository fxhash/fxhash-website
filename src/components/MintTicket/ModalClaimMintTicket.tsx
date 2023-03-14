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
import { YupDaysCoverage } from "../../utils/yup/ticket"
import { useContractOperation } from "../../hooks/useContractOperation"
import {
  TicketClaimV3Operation,
  TTicketClaimV3OperationParams,
} from "../../services/contract-operations/TicketClaimV3"
import { ContractFeedback } from "../Feedback/ContractFeedback"
import { HoverTitle } from "../Utils/HoverTitle"
import { Icon } from "../Icons/Icon"

const validation = Yup.object({
  price: YupPrice,
  days: YupDaysCoverage,
})

interface ModalClaimMintTicketProps {
  mintTicket: MintTicket
  price: number
  onClose: () => void
}

const _ModalClaimMintTicket = ({
  mintTicket,
  price,
  onClose,
}: ModalClaimMintTicketProps) => {
  const { call, success, state, error, loading } =
    useContractOperation<TTicketClaimV3OperationParams>(TicketClaimV3Operation)
  const { handleSubmit, handleChange, handleBlur, values, errors } = useFormik({
    initialValues: {
      price: mintTicket.price / 1000000,
      days: 7,
    },
    onSubmit: (submittedValues) => {
      const tzPrice = submittedValues.price * 1000000
      const amount =
        getMintTicketHarbergerTax(submittedValues.price, submittedValues.days) *
          1000000 +
        price
      call({
        ticketId: mintTicket.id,
        taxationSettings: {
          // add extra day to cover for end of period
          coverage: submittedValues.days + 1,
          price: tzPrice,
        },
        amount,
      })
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
    return (harbergerTax || 0) * 1000000 + price
  }, [harbergerTax, price])
  return (
    <Modal
      title={`Claim mint pass for “${mintTicket.token?.name}”`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <p className={style.p}>
          Before purchasing this mint pass, you must define the price at witch
          it will appear next, as well the days during which you want to hold
          the asset. If you are going to use this pass less then 24 hours after
          your purchase, the tax will fully be reimbursed.
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
                type="number"
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
                <div className={style.label_title}>
                  days covered by your tax
                </div>
                <div className={style.label_subtitle}>
                  For how long do you want your token to be secured at this
                  price? Not including the gracing period.
                </div>
              </label>
              <InputTextUnit
                name="days"
                type="number"
                classNameContainer={style.input}
                value={values.days}
                onChange={handleChange}
                onBlur={handleBlur}
                sizeX="small"
                unit="days"
                id="days"
              />
            </div>
            {errors.days && (
              <Error className={style.error}>{errors.days}</Error>
            )}
          </div>
        </div>
        <hr className={style.hr} />
        <div className={style.row_with_unit}>
          <div className={style.row_label}>Current price</div>
          <div className={style.unit}>
            <DisplayTezos mutez={price} formatBig={false} tezosSize="regular" />
          </div>
        </div>
        <Spacing size="small" />
        <div className={style.row_with_unit}>
          <div className={style.row_label}>
            Harberger tax{" "}
            <HoverTitle
              message={`0.14% of the price multiplied by number of days coverage`}
              className={cs(style.tooltip)}
            >
              <Icon icon="infos-circle" />
            </HoverTitle>
          </div>
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
        <Spacing size="small" />
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
          <Button
            type="submit"
            color="secondary"
            size="small"
            state={loading ? "loading" : "default"}
            disabled={!values.price || !values.days}
          >
            purchase mint ticket{" "}
            <DisplayTezos
              mutez={totalToPay}
              formatBig={false}
              tezosSize="regular"
            />
          </Button>
        </div>
        <div className={style.contract_feedback}>
          <ContractFeedback
            state={state}
            loading={loading}
            success={success}
            error={error}
          />
        </div>
      </form>
    </Modal>
  )
}

export const ModalClaimMintTicket = memo(_ModalClaimMintTicket)
