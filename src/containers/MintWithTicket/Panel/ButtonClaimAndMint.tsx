import React, { memo, useCallback, useContext, useMemo } from "react"
import { useQuery } from "@apollo/client"
import { Qu_genTokenClaimableMintTickets } from "../../../queries/generative-token"
import { BaseButton } from "../../../components/FxParams/BaseInput"
import style from "./PanelControls.module.scss"
import { GenerativeToken } from "../../../types/entities/GenerativeToken"
import useNow from "../../../hooks/useNow"
import { MintTicket } from "../../../types/entities/MintTicket"
import { getMintTicketDAPrice } from "../../../utils/mint-ticket"
import { DisplayTezos } from "../../../components/Display/DisplayTezos"
import { displayMutez } from "../../../utils/units"
import { UserContext } from "../../UserProvider"

type GenerativeTokenWithDaMintTickets = GenerativeToken & {
  daMintTickets: MintTicket[]
}
interface ClaimAndMintProps {
  token: GenerativeToken
  onClick: (ticket: MintTicket) => void
}

const _ClaimAndMint = ({ token, onClick }: ClaimAndMintProps) => {
  const { user } = useContext(UserContext)
  const now = useNow(15000)
  const { data } = useQuery<{
    generativeToken: GenerativeTokenWithDaMintTickets
  }>(Qu_genTokenClaimableMintTickets, {
    variables: {
      id: token.id,
      ownerId: user?.id || "nobody",
    },
  })
  const cheapestTicket = useMemo<MintTicket | null>(() => {
    if (!data?.generativeToken) return null
    const [cheapestDaTicket] = data.generativeToken.daMintTickets
      .map((ticket, idx) => {
        return {
          ...ticket,
          price: getMintTicketDAPrice(
            now,
            new Date(ticket.taxationPaidUntil),
            ticket.price
          ),
        }
      })
      .sort((a, b) => (a.price > b.price ? 1 : -1))
    const [cheapestClaimableTicket] = data.generativeToken.mintTickets
    if (cheapestDaTicket && cheapestClaimableTicket) {
      return cheapestDaTicket.price < cheapestClaimableTicket.price
        ? cheapestDaTicket
        : cheapestClaimableTicket
    }
    return cheapestDaTicket || cheapestClaimableTicket || null
  }, [data, now])
  const handleClickClaimAndMint = useCallback(() => {
    if (cheapestTicket) {
      onClick(cheapestTicket)
    }
  }, [cheapestTicket, onClick])
  return (
    cheapestTicket && (
      <BaseButton
        color="main"
        onClick={handleClickClaimAndMint}
        className={style.submitButton}
        title={`claim & mint with ${displayMutez(cheapestTicket.price)} tezos`}
      >
        claim & mint{" "}
        <DisplayTezos mutez={cheapestTicket.price} formatBig={false} />
      </BaseButton>
    )
  )
}

export const ButtonClaimAndMint = memo(_ClaimAndMint)
