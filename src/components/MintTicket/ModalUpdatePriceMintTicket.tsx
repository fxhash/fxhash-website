import React, { memo, useCallback, useState } from "react"
import { Button } from "../Button"
import { MintTicket } from "../../types/entities/MintTicket"
import { DisplayTezos } from "../Display/DisplayTezos"
import { Modal } from "../Utils/Modal"
import style from "./MintTicketModal.module.scss"
import { InputTextUnit } from "../Input/InputTextUnit"
import { Spacing } from "../Layout/Spacing"
import { useFormik } from "formik"
import { useContractOperation } from "../../hooks/useContractOperation"
import {
  TicketUpdatePriceV3Operation,
  TTicketUpdatePriceV3OperationParams,
} from "../../services/contract-operations/TicketUpdatePriceV3"
import * as Yup from "yup"
import { YupPrice } from "../../utils/yup/price"
import { Error } from "../Error/Error"
import {
  differenceInHours,
  differenceInMinutes,
  formatDuration,
  intervalToDuration,
  isBefore,
} from "date-fns"

const validation = Yup.object({
  price: YupPrice,
  days: YupPrice,
})

interface ModalUpdatePriceMintTicketProps {
  mintTicket: MintTicket
  onClose: () => void
}

const _ModalUpdatePriceMintTicket = ({
  mintTicket,
  onClose,
}: ModalUpdatePriceMintTicketProps) => {
  const { call } = useContractOperation<TTicketUpdatePriceV3OperationParams>(
    TicketUpdatePriceV3Operation
  )
  const { handleChange, handleBlur, values, errors } = useFormik({
    initialValues: {
      price: mintTicket.price / 1000000,
      days: 0,
    },
    onSubmit: (values) => {
      call({
        ticketId: mintTicket.id,
        taxationSettings: {
          coverage: values.days,
          price: values.price,
        },
        amount: 10,
      })
    },
    validationSchema: validation,
  })
  const nowDate = new Date()
  const taxStart = new Date(mintTicket.taxationStart)
  const remainingGracingPeriod = isBefore(nowDate, taxStart)
    ? differenceInHours(taxStart, nowDate)
    : 0
  const consumedTaxDays = isBefore(nowDate, taxStart)
    ? 0
    : differenceInHours(taxStart, nowDate)
  const daysCovered =
    parseInt(mintTicket.taxationLocked) / (mintTicket.price * 0.014)
  return (
    <Modal
      title={`Update price for “${mintTicket.token?.name}”`}
      onClose={onClose}
    >
      <p className={style.p}>
        Lorem ipsum dolor sit amet consectetur. Vulputate tristique malesuada
        auctor sit duis nunc vel. Viverra nibh felis massa montes tincidunt nisl
        tempus amet cursus. Eu vitae nulla est platea morbi molestie eu ut.
      </p>
      <div className={style.title}>with the current settings:</div>
      <div className={style.row_with_unit}>
        <div className={style.row_label}>
          You will keep ownership of your pass:
        </div>
        <div className={style.unit}>8 days</div>
      </div>
      <div className={style.progress_bar}>
        <div className={style.left} />
        <div className={style.right} />
      </div>
      <div className={style.row_with_unit}>
        <div className={style.row_label}>
          Gracing period{" "}
          <span className={style.regular}>
            {formatDuration(
              intervalToDuration({
                start: 0,
                end: remainingGracingPeriod * 3600000,
              }),
              { format: ["days", "hours"] }
            )}
          </span>
        </div>
        <div className={style.unit}>
          <span className={style.p}>Tax paid</span> <span>1 day 1 hours</span>
        </div>
      </div>
      <hr className={style.hr2} />
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
        </div>{" "}
      </div>
      <hr className={style.hr} />
      <p className={style.p}>
        Based on these new settings, you (have to pay / will claim back 20 tez)
      </p>
      <div className={style.container_buttons}>
        <Button type="button" size="small">
          update (cost:{" "}
          <DisplayTezos mutez={4000000} formatBig={false} tezosSize="regular" />
          )
        </Button>
      </div>
    </Modal>
  )
}

export const ModalUpdatePriceMintTicket = memo(_ModalUpdatePriceMintTicket)
