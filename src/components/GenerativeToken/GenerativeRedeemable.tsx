import style from "./GenerativePricing.module.scss"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import Link from "next/link"
import { Icon } from "../Icons/Icon"

interface Props {
  isRedeemable: boolean
  urlRedeemable?: string
}

export function GenerativeRedeemable({
  isRedeemable,
  urlRedeemable = "",
}: Props) {
  return (
    <>
      {isRedeemable && (
        <>
          <strong>Redeemable</strong>
          <span className={style.mobile_align_right}>
            <Link href={urlRedeemable}>
              <a>
                <Icon icon="sparkles" />
                <span> Yes</span>
              </a>
            </Link>
          </span>
        </>
      )}
    </>
  )
}
