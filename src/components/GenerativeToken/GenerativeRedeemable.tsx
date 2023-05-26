import style from "./GenerativeRedeemable.module.scss"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import Link from "next/link"
import { Icon } from "../Icons/Icon"
import { ToggableInfo } from "components/Layout/ToggableInfo"
import { DisplayTezos } from "components/Display/DisplayTezos"
import { DateFormatted } from "components/Utils/Date/DateFormat"
import { RedeemableDetails } from "types/entities/Redeemable"

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

  const { name, amount, expiresAt } = details

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
        <span>
          Price: <DisplayTezos mutez={amount} />
        </span>
        {expiresAt && (
          <span>
            Expires: <DateFormatted date={expiresAt} />
          </span>
        )}
      </div>
    </ToggableInfo>
  )
}
