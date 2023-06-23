import style from "./GenerativeRedeemable.module.scss"
import Link from "next/link"
import { Icon } from "../Icons/Icon"
import { ToggableInfo } from "components/Layout/ToggableInfo"
import { DisplayTezos } from "components/Display/DisplayTezos"
import { DateFormatted } from "components/Utils/Date/DateFormat"
import { RedeemableDetails } from "types/entities/Redeemable"

interface RedeemablePriceProps {
  baseAmount: number
  options: RedeemableDetails["options"]
}

const RedeemablePrice = ({ baseAmount, options }: RedeemablePriceProps) => {
  if (!options.length)
    return (
      <span>
        Price: <DisplayTezos mutez={baseAmount} />
      </span>
    )

  const calculatePriceRange = (options: RedeemableDetails["options"]) => {
    const minMaxValues = options.map((option) => {
      const amounts = option.values.map((value) => value.amount)
      return { min: Math.min(...amounts), max: Math.max(...amounts) }
    })

    const sumMin = minMaxValues.reduce((acc, option) => acc + option.min, 0)
    const sumMax = minMaxValues.reduce((acc, option) => acc + option.max, 0)

    return { min: sumMin, max: sumMax }
  }

  const { min, max } = calculatePriceRange(options)

  return (
    <span>
      Price: <DisplayTezos mutez={baseAmount + min} />
      {" -> "}
      <DisplayTezos mutez={baseAmount + max} />
    </span>
  )
}

interface Props {
  urlRedeemable: string
  details?: RedeemableDetails | null
  redeemedPercentage?: number | null
  toggled?: boolean
}

export function GenerativeRedeemable({
  urlRedeemable = "",
  details = null,
  redeemedPercentage = null,
  toggled,
}: Props) {
  if (!details)
    return (
      <>
        <strong>Redeemable</strong>
        <span className={style.mobile_align_right}>
          <Link href={urlRedeemable}>
            <a>
              <Icon icon="sparkles" />
              <span> redeem</span>
            </a>
          </Link>
        </span>
      </>
    )

  const { name, amount, expiresAt, options } = details

  return (
    <ToggableInfo
      label="Redeemable"
      toggled={toggled}
      placeholder={
        <span className={style.mobile_align_right}>
          <Link href={urlRedeemable}>
            <a>
              <Icon icon="sparkles" />
              <span> {name}</span>
            </a>
          </Link>
        </span>
      }
    >
      <div className={style.details}>
        <span className={style.mobile_align_right}>
          <Link href={urlRedeemable}>
            <a>
              <Icon icon="sparkles" />
              <span> {name}</span>
            </a>
          </Link>
        </span>
        {redeemedPercentage !== null && (
          <span>Redeemed: {redeemedPercentage.toFixed(1)}%</span>
        )}
        <RedeemablePrice baseAmount={amount} options={options} />
        {expiresAt && (
          <span>
            Expires: <DateFormatted date={expiresAt} />
          </span>
        )}
      </div>
    </ToggableInfo>
  )
}
