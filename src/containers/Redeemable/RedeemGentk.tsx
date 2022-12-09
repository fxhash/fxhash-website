import style from "./RedeemGentk.module.scss"
import cs from "classnames"
import { Objkt } from "types/entities/Objkt"
import { RedeemableDetails } from "types/entities/Redeemable"

interface Props {
  gentk: Objkt
  redeemable: RedeemableDetails
}
export function RedeemGentk({ gentk, redeemable }: Props) {
  console.log({ gentk, redeemable })
  // todo
  // * summary of redeemable
  // * list the different options
  // * user inputs derived from definition (parametric validation, & form builder)
  // * sign data with wallet
  // * send payload to the backend for authentication, and backend validates inputs
  // * backend responds with a payload + signature
  // * make the contract call to redeem the token

  return <div>redeem here !!</div>
}
