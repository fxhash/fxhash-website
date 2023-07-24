import React, { memo, useContext } from "react"
import cs from "classnames"
import layout from "../../../styles/Layout.module.scss"
import Link from "next/link"
import { getGenerativeTokenUrl } from "../../../utils/generative-token"
import { Button } from "../../../components/Button"
import { Icon } from "../../../components/Icons/Icon"
import { Spacing } from "../../../components/Layout/Spacing"
import { RedeemableDetailsView } from "../../../components/Entities/RedeemableDetailsView"
import { RedeemableDetails } from "../../../types/entities/Redeemable"
import { GenerativeToken } from "../../../types/entities/GenerativeToken"
import style from "./GenerativeRedeem.module.scss"
import { CardsExplorer } from "components/Exploration/CardsExplorer"
import { useInfiniteScroll } from "hooks/useInfiniteScroll"
import { useQuery } from "@apollo/client"
import { Qu_genTokenIterations } from "queries/generative-token"
import { Objkt } from "types/entities/Objkt"
import { GentkList } from "components/GenerativeToken/GentkList"
import { UserContext } from "containers/UserProvider"

const ITEMS_PER_PAGE = 20
interface GenerativeRedeemProps {
  token: GenerativeToken
  redeemableDetails: RedeemableDetails[]
}

const _GenerativeRedeem = ({
  token,
  redeemableDetails,
}: GenerativeRedeemProps) => {
  const { user } = useContext(UserContext)

  const { data, loading, fetchMore } = useQuery(Qu_genTokenIterations, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: token.id,
      skip: 0,
      take: ITEMS_PER_PAGE,
      filters: {
        redeemable_eq: true,
        owner_in: user ? [user.id] : undefined,
      },
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-and-network",
  })

  /**
   * TEMP UNTIL WE HAVE AN API FIX
   * filter out any redeemables that have been made inactive
   */
  const activeRedeemableAddresses = redeemableDetails.map((r) => r.address)
  const tokens: Objkt[] | null = data?.generativeToken?.objkts.filter(
    (o: Objkt) =>
      o.availableRedeemables.some((r) =>
        activeRedeemableAddresses.includes(r.address)
      )
  )

  const { topMarkerRef, onEndReached } = useInfiniteScroll({
    loading,
    itemLength: tokens?.length || 0,
    onFetchMore: () => {
      fetchMore?.({
        variables: {
          skip: tokens?.length || 0,
          take: ITEMS_PER_PAGE,
        },
      })
    },
  })

  const renderBackToProject = (
    <div className={cs(layout.flex_column_left)}>
      <Link href={getGenerativeTokenUrl(token)}>
        <Button isLink iconComp={<Icon icon="arrow-left" />} size="small">
          back to project
        </Button>
      </Link>
    </div>
  )
  return (
    <div className={style.root}>
      {renderBackToProject}
      <Spacing size="x-large" />
      <div>
        {redeemableDetails.map((details) => (
          <RedeemableDetailsView
            key={details.address}
            details={details}
            title={token.name}
            info={
              <span>
                The iterations of this project can be redeemed to activate an
                event. Redeeming a token will not destroy it, and owners will
                keep the ownership of their token.
              </span>
            }
          />
        ))}
      </div>
      <Spacing size="x-large" />
      <CardsExplorer cardSizeScope="generative-iteration">
        {({ refCardsContainer, cardSize }) => (
          <>
            <div ref={topMarkerRef} />

            <div style={{ width: "100%" }}>
              <GentkList
                tokens={tokens}
                loading={loading}
                cardSize={cardSize}
                itemsPerPage={ITEMS_PER_PAGE}
                canTrigger={!!data && !loading}
                onEndReached={onEndReached}
                refCardsContainer={refCardsContainer}
                emptyMessage="You don't have any iterations of this project that can be redeemed."
              />
            </div>
          </>
        )}
      </CardsExplorer>
      <Spacing size="x-large" />
      {renderBackToProject}
    </div>
  )
}

export const GenerativeRedeem = memo(_GenerativeRedeem)
