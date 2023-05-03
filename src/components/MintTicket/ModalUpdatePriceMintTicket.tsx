import React, { memo, useCallback, useMemo, useState } from "react"
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
  addDays,
  differenceInHours,
  differenceInSeconds,
  format,
} from "date-fns"
import { YupDaysCoverage } from "../../utils/yup/ticket"
import cs from "classnames"
import { getDaysCoveredByHarbergerTax } from "../../utils/math"
import { ContractFeedback } from "../Feedback/ContractFeedback"
import colors from "../../styles/Colors.module.css"
import { plural } from "../../utils/strings"
import { getDiffByPath } from "../../utils/indexing"
import {
  getTicketLastDayConsumed,
  getUpdatedPriceAmountToPayOrClaim,
} from "./updatePrice"

const validation = Yup.object({
  price: YupPrice,
  days: YupDaysCoverage,
})

interface ModalUpdatePriceMintTicketProps {
  mintTicket: MintTicket
  onClose: () => void
}

const _ModalUpdatePriceMintTicket = ({
  mintTicket,
  onClose,
}: ModalUpdatePriceMintTicketProps) => {
  const [currentMintTicket, setCurrentMintTicket] = useState(mintTicket)
  const { state, error, call, loading, success } =
    useContractOperation<TTicketUpdatePriceV3OperationParams>(
      TicketUpdatePriceV3Operation,
      {
        onSuccess: (data) => {
          const diffTokenData = getDiffByPath(
            data.opData[0].diffs,
            "token_data"
          )
          setCurrentMintTicket((oldTicket) => {
            return {
              ...oldTicket,
              ...(diffTokenData
                ? {
                    price: diffTokenData.content.value.price,
                    taxationStart: diffTokenData.content.value.taxation_start,
                    taxationLocked: diffTokenData.content.value.taxation_locked,
                  }
                : {}),
            }
          })
          handleResetForm()
        },
      }
    )
  const { handleChange, handleBlur, handleSubmit, values, errors, resetForm } =
    useFormik({
      initialValues: {
        price: currentMintTicket.price / 1000000,
        days: 0,
      },
      onSubmit: (submittedValues) => {
        const daysCoverageWithExtraDay = submittedValues.days + 1
        const tzPrice = Math.ceil(submittedValues.price * 1000000)
        const daysSinceCreated = Math.trunc(
          (new Date().getTime() -
            new Date(currentMintTicket.createdAt).getTime()) /
            86400000
        )
        const remainingGracingPeriodInDays = Math.max(
          0,
          currentMintTicket.settings.gracingPeriod - daysSinceCreated
        )
        const amount = getUpdatedPriceAmountToPayOrClaim(
          currentMintTicket,
          tzPrice,
          daysCoverageWithExtraDay
        )
        call({
          ticketId: currentMintTicket.id,
          taxationSettings: {
            coverage: remainingGracingPeriodInDays + daysCoverageWithExtraDay,
            price: tzPrice,
          },
          amount: amount < 0 ? 0 : Math.ceil(amount),
        })
      },
      validationSchema: validation,
    })

  const handleResetForm = useCallback(() => {
    resetForm()
  }, [resetForm])
  const formatHours = useCallback((hours: number) => {
    const absHours = Math.abs(hours)
    const days = Math.floor(absHours / 24)
    const hoursRemaining = absHours % 24
    const strArr = []
    if (days) {
      strArr.push(`${days} day${plural(days)}`)
    }
    if (hoursRemaining) {
      strArr.push(`${hoursRemaining} hour${plural(hoursRemaining)}`)
    }
    return strArr.join(" ")
  }, [])

  const getStyleGracingPeriodProgress = useCallback(
    (remainingInHours, totalInHours) => {
      const percentGracingPeriod = (remainingInHours * 100) / totalInHours
      return {
        width: `${percentGracingPeriod}%`,
      }
    },
    []
  )

  const currentCoverageInHours = useMemo(() => {
    const nowDate = new Date()
    const taxStart = new Date(currentMintTicket.taxationStart)
    const remainingGracingPeriodInHours =
      nowDate < taxStart ? differenceInHours(taxStart, nowDate) : 0
    const consumedTaxDaysInHours =
      nowDate < taxStart ? 0 : differenceInHours(nowDate, taxStart)
    const daysCoveredInHours =
      getDaysCoveredByHarbergerTax(
        parseInt(currentMintTicket.taxationLocked),
        currentMintTicket.price
      ) * 24
    const remainingTaxCoverageInHours =
      daysCoveredInHours - consumedTaxDaysInHours
    const totalCoveredInHours =
      remainingGracingPeriodInHours + remainingTaxCoverageInHours
    return {
      remainingGracingPeriod: remainingGracingPeriodInHours,
      remainingTax: remainingTaxCoverageInHours,
      total: totalCoveredInHours,
    }
  }, [
    currentMintTicket.price,
    currentMintTicket.taxationLocked,
    currentMintTicket.taxationStart,
  ])

  const coverageWithExtraDay = useMemo(
    () => (values.days || 0) + 1,
    [values.days]
  )
  const newCoverageInHours = useMemo(() => {
    const newDaysCoveredInHours = coverageWithExtraDay * 24
    const lastDayConsumed = getTicketLastDayConsumed(
      currentMintTicket.createdAt
    )
    const consumedTodayHours = differenceInHours(new Date(), lastDayConsumed)
    const newTotalCoveredInHours =
      currentCoverageInHours.remainingGracingPeriod +
      newDaysCoveredInHours -
      consumedTodayHours

    const newEndDate = addDays(lastDayConsumed, coverageWithExtraDay)
    return {
      total: newTotalCoveredInHours,
      endDate: newEndDate,
    }
  }, [
    coverageWithExtraDay,
    currentCoverageInHours.remainingGracingPeriod,
    currentMintTicket.createdAt,
  ])

  const absTotalToPayOrClaim = useMemo(() => {
    const totalToPayOrClaim = getUpdatedPriceAmountToPayOrClaim(
      currentMintTicket,
      values.price * 1000000,
      coverageWithExtraDay
    )
    return {
      total: Math.abs(totalToPayOrClaim),
      type: totalToPayOrClaim < 0 ? "claim" : "cost",
    }
  }, [currentMintTicket, coverageWithExtraDay, values.price])

  const formattedGracingPeriod = formatHours(
    currentCoverageInHours.remainingGracingPeriod
  )
  const formattedRemainingTaxCoverage = formatHours(
    currentCoverageInHours.remainingTax
  )
  const formattedTotal = formatHours(currentCoverageInHours.total)
  const differenceBetweenNewAndCurrentCover =
    currentCoverageInHours.total - newCoverageInHours.total
  const isNewLongerCover = differenceBetweenNewAndCurrentCover < 0
  const formattedDifferenceBetweenCurrentAndNewCover = formatHours(
    differenceBetweenNewAndCurrentCover
  )

  const styleGracingPeriod = getStyleGracingPeriodProgress(
    currentCoverageInHours.remainingGracingPeriod,
    currentCoverageInHours.total
  )
  const styleNewGracingPeriod = getStyleGracingPeriodProgress(
    currentCoverageInHours.remainingGracingPeriod,
    newCoverageInHours.total
  )
  const progressBarsWidth = isNewLongerCover
    ? {
        current:
          (currentCoverageInHours.total * 100) / newCoverageInHours.total,
        new: 100,
      }
    : {
        current: 100,
        new: (newCoverageInHours.total * 100) / currentCoverageInHours.total,
      }
  return (
    <Modal
      title={`Update price for “${currentMintTicket.token?.name}”`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <p className={style.p}>
          After the grace period, your unexchanged tickets are listed for sale.
          During this time, you need to pay a daily tax proportional to your
          ticket&apos;s list price.
          <br />
          <br />
          Adjust the list price to higher or lower your tax payment. If you miss
          a tax payment, you will lose ownership of your ticket during
          foreclosure.
        </p>
        <div className={style.title}>with the current settings:</div>
        <div className={style.row_with_unit}>
          <div className={style.row_label}>
            You will keep ownership of your ticket:
          </div>
          <div className={style.unit}>
            <span>{formattedTotal}</span>
            {values.days > 0 && differenceBetweenNewAndCurrentCover !== 0 && (
              <span
                className={cs({
                  [colors.success]: isNewLongerCover,
                  [colors.error]: !isNewLongerCover,
                })}
              >
                {` (${
                  isNewLongerCover ? "+" : "-"
                }${formattedDifferenceBetweenCurrentAndNewCover})`}
              </span>
            )}
          </div>
        </div>
        <Spacing size="regular" />
        <div className={style.row_with_unit}>
          <div className={style.row_label}>
            Grace period{" "}
            <span className={style.regular}>
              {formattedGracingPeriod || "0 day"}
            </span>
          </div>
          <div className={style.unit}>
            <span className={style.p}>Tax paid</span>{" "}
            <span>{formattedRemainingTaxCoverage || "0 day"}</span>
          </div>
        </div>
        <Spacing size="2x-small" sm="small" />
        <div className={style.container_period}>
          <div className={style.label_bar}>Current</div>
          <div className={style.container_bar}>
            <div
              className={style.progress_bar}
              style={{
                width: `${progressBarsWidth.current}%`,
              }}
            >
              <div className={style.left} style={styleGracingPeriod} />
              <div className={style.right} />
            </div>
          </div>
        </div>
        {values.days > 0 && (
          <>
            <Spacing size="none" sm="x-small" />
            <div className={style.container_period}>
              <div className={style.label_bar}>New</div>
              <div className={style.container_bar}>
                <div
                  className={cs(style.progress_bar, style.new)}
                  style={{
                    width: `${progressBarsWidth.new}%`,
                  }}
                >
                  <div className={style.left} style={styleNewGracingPeriod} />
                  <div className={style.right} />
                </div>
              </div>
            </div>
            <Spacing size="2x-small" sm="small" />
            <div className={style.row_with_unit}>
              <div className={style.row_label} />
              <div className={style.unit}>
                <span className={style.p}>Will end on</span>{" "}
                <span>
                  {format(newCoverageInHours.endDate, "dd/MM/yy 'at' H:m")}
                </span>
              </div>
            </div>
          </>
        )}
        <hr className={style.hr2} />
        <Spacing size="regular" />
        <div className={style.container_inputs}>
          <div className={style.field}>
            <div className={style.container_input}>
              <label htmlFor="price">
                <div className={style.label_title}>price</div>
                <div className={style.label_subtitle}>
                  Anyone can buy your ticket for this price.
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
                min={0.1}
                step="any"
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
                  This is the length of time secured by your current tax
                  settings (not including the grace period).
                </div>
              </label>
              <InputTextUnit
                name="days"
                classNameContainer={style.input}
                value={values.days}
                onChange={handleChange}
                onBlur={handleBlur}
                sizeX="small"
                type="number"
                unit="days"
                id="days"
                min={0}
              />
            </div>
            {errors.days && (
              <Error className={style.error}>{errors.days}</Error>
            )}
          </div>{" "}
        </div>
        <hr className={style.hr} />
        <p className={style.p}>
          Based on these new settings, you&nbsp;will&nbsp;
          <span className={cs(style.claim)}>
            {absTotalToPayOrClaim.type === "claim" ? "get back" : "have to pay"}
          </span>{" "}
          <DisplayTezos
            mutez={absTotalToPayOrClaim.total}
            formatBig={false}
            tezosSize="regular"
          />{" "}
          tez
        </p>
        <Spacing size="small" />
        <div className={style.container_buttons}>
          <Button
            type="submit"
            size="small"
            state={loading ? "loading" : "default"}
            disabled={!values.price || !values.days}
          >
            update ({absTotalToPayOrClaim.type}:{" "}
            <DisplayTezos
              mutez={absTotalToPayOrClaim.total}
              formatBig={false}
              tezosSize="regular"
            />
            )
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

export const ModalUpdatePriceMintTicket = memo(_ModalUpdatePriceMintTicket)
