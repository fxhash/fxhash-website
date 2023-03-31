import style from "./PanelControls.module.scss"
import { BaseButton, IconButton } from "components/FxParams/BaseInput"

import {
  faArrowLeft,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useEffect, useMemo } from "react"
import { UserContext } from "containers/UserProvider"
import { useLazyQuery } from "@apollo/client"
import { Qu_userMintTickets } from "queries/user"
import { MintTicket } from "types/entities/MintTicket"
import { GenerativeToken } from "types/entities/GenerativeToken"
import { DisplayTezos } from "components/Display/DisplayTezos"
import { displayMutez } from "utils/units"
import { TOnMintHandler } from "../MintWithTicketPage"
import { isBefore } from "date-fns"
import { useMintingState } from "hooks/useMintingState"

export type PanelSubmitMode = "with-ticket" | "free" | "none"

export interface PanelControlsProps {
  token: GenerativeToken
  onClickBack?: () => void
  onOpenNewTab?: () => void
  onSubmit: TOnMintHandler
  submitLabel?: string
  hideSubmit?: boolean
  mode?: PanelSubmitMode
}

export function PanelControls(props: PanelControlsProps) {
  const {
    token,
    onClickBack,
    onOpenNewTab,
    onSubmit,
    submitLabel = "mint",
    mode = "none",
    hideSubmit,
  } = props

  const { user } = useContext(UserContext)

  const mintingState = useMintingState(token)
  const { enabled, locked, price } = mintingState

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
      .sort((a, b) =>
        (a.taxationPaidUntil as any) < (b.taxationPaidUntil as any) ? 1 : -1
      )
    return projectTickets.length > 0 ? projectTickets : null
  }, [data])

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
            {!locked && enabled && (
              <BaseButton
                color="main"
                onClick={() => onSubmit(null)}
                className={style.submitButton}
                title={`mint with ${displayMutez(price)} tezos`}
              >
                mint <DisplayTezos mutez={price} formatBig={false} />
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
