import React, { memo, useContext } from "react"
import { GenerativeToken } from "../../../types/entities/GenerativeToken"
import Link from "next/link"
import { getGenerativeTokenUrl } from "../../../utils/generative-token"
import { Button } from "../../../components/Button"
import { UserContext } from "../../UserProvider"
import { useQuery } from "@apollo/client"
import { Qu_MintTickets } from "../../../queries/mint-ticket"
import style from "./GenerativeDisplay.module.scss";

interface ButtonExploreParamsProps {
  token: GenerativeToken
}

const _ButtonExploreParams = ({ token }: ButtonExploreParamsProps) => {
  const { user } = useContext(UserContext)
  const { data } = useQuery(Qu_MintTickets, {
    variables: {
      take: 1,
      filters: {
        token_eq: token.id,
        owner_eq: user?.id,
      },
    },
    skip: !user,
  })
  const hasAtLeastOneTicket = user && data?.mintTickets.length > 0
  return (
    <Link href={`${getGenerativeTokenUrl(token)}/explore-params`} passHref>
      <Button
        isLink={true}
        size="regular"
        color={hasAtLeastOneTicket ? "secondary" : "black"}
        iconSide="right"
        className={style.button}
      >
        {hasAtLeastOneTicket ? (
          <>
            use ticket
            <i className="fa-sharp fa-solid fa-ticket" aria-hidden />
          </>
        ) : (
          <>
            explore params{" "}
            <i aria-hidden className="fa-sharp fa-regular fa-slider" />
          </>
        )}
      </Button>
    </Link>
  )
}

export const ButtonExploreParams = memo(_ButtonExploreParams)
