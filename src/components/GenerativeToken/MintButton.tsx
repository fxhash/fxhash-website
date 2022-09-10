import style from "./MintButton.module.scss"
import effects from "../../styles/Effects.module.scss"
import cs from "classnames"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { PropsWithChildren, useContext, useMemo, useState } from "react"
import { Button } from "../../components/Button"
import { UserContext } from "../../containers/UserProvider"
import { getReserveConsumptionMethod, reserveEligibleAmount, reserveSize } from "../../utils/generative-token"
import { User } from "../../types/entities/User"
import { Cover } from "../Utils/Cover"
import { LiveMintingContext } from "../../context/LiveMinting"
import { IReserveConsumption } from "../../services/contract-operations/Mint"


/**
 * The Mint Button displays a mint button component with specific display rules
 * based on the balance, reserve of the token and the eligibility state of the
 * user.
 * display conditions:
 * - if user is in the reserve
 *    - onlyReserveLeft: show button mint, mint from the resserve
 *    - !onlyReserveLeft: show mint button with dropdown
 * - if user is not in the reserve
 *    - onlyReserveLeft: hide mint button
 *    - !onlyReserveLeft: show mint button, mint without the reserve
 */

interface Props {
  token: GenerativeToken
  loading: boolean
  disabled: boolean
  onMint: (reserveConsumption: IReserveConsumption|null) => void
  forceReserveConsumption?: boolean
}
export function MintButton({
  token,
  loading,
  disabled,
  onMint,
  forceReserveConsumption = false,
  children,
}: PropsWithChildren<Props>) {
  // user ctx
  const { user } = useContext(UserContext)
  // live minting ctx
  const liveMintingContext = useContext(LiveMintingContext)

  const [showDropdown, setShowDropdown] = useState(false)
  
  // the number of editions left in the reserve
  const reserveLeft = useMemo(
    () => reserveSize(token),
    [token]
  )

  // only the reserve is available for minting
  const onlyReserveLeft = reserveLeft === token.balance

  // compute how many editions in reserve the user is eligible for
  const eligibleFor = useMemo(
    () => user
      ? reserveEligibleAmount(user as User, token, liveMintingContext)
      : 0,
    [user, token]
  )
  const userEligible = eligibleFor > 0

  // should we show the button with dropdown
  const isMintDropdown = userEligible && !onlyReserveLeft
  // conditions required to show the regular mint button
  const isMintButton = !isMintDropdown
    && ((userEligible && onlyReserveLeft) || !onlyReserveLeft)

  return (isMintButton || isMintDropdown) ? (
    <>
    
      <div className={cs(style.root)}>
        <Button
          type="button"
          color="secondary"
          size="regular"
          state={loading ? "loading" : "default"}
          disabled={disabled}
          onClick={() => {
            if (isMintButton) {
              onMint(
                // to trigger reserve, user must be eligible
                userEligible
                // there must only be reserve or reserve forced
                && (onlyReserveLeft || forceReserveConsumption)
                // returns the consumption method
                && getReserveConsumptionMethod(
                  token,
                  user as User,
                  liveMintingContext
                )
                // fallback to null
                || null
              )
            }
            else {
              setShowDropdown(!showDropdown)
            }
          }}
        >
          {children}
          {isMintDropdown && (
            <i
              aria-hidden 
              className={cs(
                `fas fa-caret-down`,
                style.caret
              )}
              style={{
                transform: showDropdown ? "rotate(180deg)" : "none",
              }}
            />
          )}
        </Button>

        {showDropdown && (
          <div className={cs(style.dropdown)}>
            <button
              type="button"
              onClick={() => {
                setShowDropdown(false)
                onMint(getReserveConsumptionMethod(
                  token,
                  user as User,
                  liveMintingContext,
                ))
              }}
              >
              using your reserve
            </button>
            <button
              type="button"
              onClick={() => {
                setShowDropdown(false)
                onMint(null)
              }}
            >
              without reserve
            </button>
          </div>
        )}
      </div>

      {showDropdown && (
        <Cover
          index={100}
          onClick={() => setShowDropdown(false)}
          opacity={0}
        />
      )}
    </>
  ):null
}