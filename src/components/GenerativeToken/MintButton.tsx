import style from "./MintButton.module.scss"
import cs from "classnames"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { PropsWithChildren, useContext } from "react"
import { Button } from "../../components/Button"
import { UserContext } from "../../containers/UserProvider"
import { Cover } from "../Utils/Cover"
import { IReserveConsumption } from "../../services/contract-operations/Mint"
import { ButtonPaymentCard } from "../Utils/ButtonPaymentCard"
import { useMintReserveInfo } from "hooks/useMintReserveInfo"
import { ReserveDropdown } from "./ReserveDropdown"

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
  onMint: (reserveConsumption: IReserveConsumption | null) => void
  forceReserveConsumption?: boolean
  hasCreditCardOption?: boolean
  openCreditCard?: () => void
}
export function MintButton({
  token,
  loading,
  disabled,
  onMint,
  forceReserveConsumption = false,
  hasCreditCardOption = false,
  openCreditCard,
  children,
}: PropsWithChildren<Props>) {
  const { isLiveMinting } = useContext(UserContext)
  const {
    showDropdown,
    setShowDropdown,
    userEligible,
    onlyReserveLeft,
    isMintButton,
    isMintDropdown,
    reserveConsumptionMethod,
  } = useMintReserveInfo(token, forceReserveConsumption)

  return isMintButton || isMintDropdown ? (
    <>
      <div
        className={cs(style.btns_wrapper, {
          [style.reversed]: isLiveMinting,
        })}
      >
        <div className={cs(style.root)}>
          <Button
            type="button"
            color={isLiveMinting ? "secondary-inverted" : "secondary"}
            size="regular"
            state={loading ? "loading" : "default"}
            className={cs(style.button, {
              [style.narrow]: isLiveMinting,
            })}
            disabled={disabled}
            onClick={() => {
              if (isMintButton) {
                // TODO: SEE IF BELOW CAN BE CLEANED UP
                onMint(
                  // to trigger reserve, user must be eligible
                  (userEligible &&
                    // there must only be reserve or reserve forced
                    (onlyReserveLeft || forceReserveConsumption) &&
                    // returns the consumption method
                    reserveConsumptionMethod) ||
                    // fallback to null
                    null
                )
              } else {
                setShowDropdown(!showDropdown)
              }
            }}
          >
            {children}
            {isMintDropdown && (
              <i
                aria-hidden
                className={cs(`fas fa-caret-down`, style.caret)}
                style={{
                  transform: showDropdown ? "rotate(180deg)" : "none",
                }}
              />
            )}
          </Button>

          {showDropdown && (
            <ReserveDropdown
              hideDropdown={() => setShowDropdown(false)}
              onMint={onMint}
              reserveConsumptionMethod={reserveConsumptionMethod}
            />
          )}
        </div>

        {hasCreditCardOption &&
          !loading &&
          !(userEligible && onlyReserveLeft) && (
            <ButtonPaymentCard onClick={openCreditCard} disabled={disabled} />
          )}
      </div>

      {showDropdown && (
        <Cover index={100} onClick={() => setShowDropdown(false)} opacity={0} />
      )}
    </>
  ) : null
}
