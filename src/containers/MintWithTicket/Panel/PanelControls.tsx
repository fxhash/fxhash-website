import style from "./PanelControls.module.scss"
import { BaseButton, IconButton } from "components/FxParams/BaseInput"

import {
  faArrowLeft,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useCallback, useContext, useMemo } from "react"
import { UserContext } from "containers/UserProvider"
import { useQuery } from "@apollo/client"
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
  mode?: PanelSubmitMode
}

export function PanelControls(props: PanelControlsProps) {
  const { token, onClickBack, onOpenNewTab, onSubmit, mode = "none" } = props

  const { user } = useContext(UserContext)

  const { enabled, locked, price, hidden } = useMintingState(token)
  const showMintButton = !hidden && !locked && enabled

  // get user mint tickets when user is available, and mode is "free"
  const { data } = useQuery(Qu_userMintTickets, {
    fetchPolicy: "network-only",
    variables: {
      id: user?.id,
    },
    skip: !(mode === "free" && user),
  })

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
  }, [data, token.id])

  const handleClickMint = useCallback(() => {
    onSubmit(null)
  }, [onSubmit])
  const handleClickUseTicket = useCallback(() => {
    if (userTickets) {
      onSubmit(userTickets.map((ticket) => ticket.id))
    }
  }, [onSubmit, userTickets])

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
            onClick={handleClickMint}
            className={style.submitButton}
            title={"use ticket"}
          >
            use ticket <i className="fa-sharp fa-solid fa-ticket" aria-hidden />
          </BaseButton>
        ) : mode === "free" ? (
          <div className={style.submitButtons}>
            {showMintButton && (
              <BaseButton
                color="main"
                onClick={handleClickMint}
                className={style.submitButton}
                title={`mint with ${displayMutez(price)} tezos`}
              >
                mint <DisplayTezos mutez={price} formatBig={false} />
              </BaseButton>
            )}
            {userTickets && (
              <BaseButton
                color="main"
                onClick={handleClickUseTicket}
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
