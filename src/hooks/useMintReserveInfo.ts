import { useContext, useMemo, useState } from "react"
import { UserContext } from "containers/UserProvider"
import { LiveMintingContext } from "context/LiveMinting"
import { GenerativeToken } from "types/entities/GenerativeToken"
import { User } from "types/entities/User"
import {
  getReserveConsumptionMethod,
  reserveEligibleAmount,
  reserveSize,
} from "utils/generative-token"

export const useMintReserveInfo = (
  token: GenerativeToken,
  forceReserveConsumption = false
) => {
  const { user } = useContext(UserContext)
  const liveMintingContext = useContext(LiveMintingContext)

  // the number of editions left in the reserve
  const reserveLeft = useMemo(() => reserveSize(token), [token])

  // only the reserve is available for minting
  const onlyReserveLeft = reserveLeft === token.balance

  // compute how many editions in reserve the user is eligible for
  const eligibleFor = useMemo(
    () =>
      user ? reserveEligibleAmount(user as User, token, liveMintingContext) : 0,
    [user, token]
  )
  const userEligible = eligibleFor > 0

  // should we show the button with dropdown
  const isMintDropdown =
    userEligible && !onlyReserveLeft && !forceReserveConsumption
  // conditions required to show the regular mint button
  const isMintButton =
    !isMintDropdown && ((userEligible && onlyReserveLeft) || !onlyReserveLeft)

  // should we use the reserve without showing the dropdown
  const onMintShouldUseReserve =
    // to trigger reserve, user must be eligible
    userEligible &&
    // there must only be reserve or reserve forced
    (onlyReserveLeft || forceReserveConsumption)

  const reserveConsumptionMethod = user
    ? getReserveConsumptionMethod(token, user as User, liveMintingContext)
    : null

  return {
    isMintDropdown,
    isMintButton,
    userEligible,
    onMintShouldUseReserve,
    reserveConsumptionMethod,
  }
}
