import style from "./PanelControls.module.scss"
import { BaseButton, IconButton } from "components/FxParams/BaseInput"

import {
  faArrowLeft,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useEffect, useMemo } from "react"
import { UserContext } from "containers/UserProvider"
import { PanelSubmitMode } from "./PanelRoot"
import { useLazyQuery, useQuery } from "@apollo/client"
import { Qu_userMintTickets } from "queries/user"
import { MintTicket } from "types/entities/MintTicket"
import { GenerativeToken } from "types/entities/GenerativeToken"
import { DisplayTezos } from "components/Display/DisplayTezos"
import { genTokCurrentPrice, getReservesAmount } from "utils/generative-token"
import { displayMutez } from "utils/units"
import { TOnMintHandler } from "../MintWithTicketPage"
import { isBefore } from "date-fns"

interface Props {
  token: GenerativeToken
  onClickBack?: () => void
  onOpenNewTab?: () => void
  onSubmit: TOnMintHandler
  submitLabel?: string
  hideSubmit?: boolean
  mode: PanelSubmitMode
}

export function PanelControls(props: Props) {
  const {
    token,
    onClickBack,
    onOpenNewTab,
    onSubmit,
    submitLabel = "mint",
    mode,
    hideSubmit,
  } = props

  const { user } = useContext(UserContext)

  // get user mint tickets when user is available, and mode is "free"
  const [getUserTickets, { data, loading, error }] = useLazyQuery(
    Qu_userMintTickets,
    {
      fetchPolicy: "network-only",
    }
  )
  useEffect(() => {
    if (mode === "free" && user && !loading && !data && !error) {
      getUserTickets({
        variables: {
          id: user.id,
        },
      })
    }
  }, [user, loading, data, error])

  // extract user tickets for this project
  const userTickets = useMemo(() => {
    if (!data) return null
    if (!data.user?.mintTickets) return null
    const projectTickets = (data.user.mintTickets as MintTicket[])
      .filter((ticket) => ticket.token.id === token.id)
      .filter((ticket) =>
        isBefore(new Date(), new Date(ticket.taxationPaidUntil))
      )
      .sort(
        (a, b) => (a.taxationPaidUntil as any) - (b.taxationPaidUntil as any)
      )
    return projectTickets.length > 0 ? projectTickets : null
  }, [data])

  // balance after reserve slots
  const balanceWithoutReserve =
    token.balance - getReservesAmount(token.reserves)

  return (
    <div className={style.controlPanel}>
      <div className={style.buttonsWrapper}>
        {onClickBack && (
          <IconButton onClick={onClickBack} title="go back to project page">
            <FontAwesomeIcon icon={faArrowLeft} />
          </IconButton>
        )}
        {onOpenNewTab && (
          <IconButton
            onClick={onOpenNewTab}
            title="open this variant into a new tab"
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </IconButton>
        )}
        {mode === "with-ticket" ? (
          <BaseButton
            color="main"
            onClick={() => onSubmit(null)}
            className={style.submitButton}
            title={submitLabel}
          >
            {submitLabel}
          </BaseButton>
        ) : mode === "free" ? (
          <div className={style.submitButtons}>
            {balanceWithoutReserve > 0 && (
              <BaseButton
                color="main"
                onClick={() => onSubmit(null)}
                className={style.submitButton}
                title={`mint with ${displayMutez(
                  genTokCurrentPrice(token)
                )} tezos`}
              >
                mint{" "}
                <DisplayTezos
                  mutez={genTokCurrentPrice(token)}
                  formatBig={false}
                />
              </BaseButton>
            )}
            {userTickets && (
              <BaseButton
                color="main"
                onClick={() => onSubmit(userTickets[0].id)}
                className={style.submitButton}
                title="exchange your ticket for an iteration"
              >
                use ticket{" "}
                <i className="fa-sharp fa-solid fa-ticket" aria-hidden />
              </BaseButton>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
