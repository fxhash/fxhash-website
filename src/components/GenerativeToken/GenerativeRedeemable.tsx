import style from "./GenerativePricing.module.scss"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import Link from "next/link"
import { Icon } from "../Icons/Icon"

interface Props {
  token: GenerativeToken
}

export function GenerativeRedeemable({ token }: Props) {
  return (
    <>
      {token.redeemables && token.redeemables.length > 0 && (
        <>
          <strong>Redeemable</strong>
          <span className={style.mobile_align_right}>
            <Link href={`/generative/${token.id}/redeem`}>
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
