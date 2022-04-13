import style from "./GenerativeOffersMarketplace.module.scss"
import cs from "classnames"
import { useQuery } from '@apollo/client'
import { CardsContainer } from '../../components/Card/CardsContainer'
import { ObjktCard } from '../../components/Card/ObjktCard'
import { useState, useEffect, useMemo, useRef } from 'react'
import { Spacing } from '../../components/Layout/Spacing'
import { IOptions, Select } from '../../components/Input/Select'
import { GenerativeToken } from '../../types/entities/GenerativeToken'
import { Objkt } from '../../types/entities/Objkt'
import { InfiniteScrollTrigger } from "../../components/Utils/InfiniteScrollTrigger"
import { CardsLoading } from "../../components/Card/CardsLoading"
import { Qu_genTokListings } from "../../queries/marketplace"


const ITEMS_PER_PAGE = 20

const sortOptions: IOptions[] = [
  {
    label: "recently listed",
    value: "listingCreatedAt-desc"
  },
  {
    label: "price (high to low)",
    value: "listingPrice-desc",
  },
  {
    label: "price (low to high)",
    value: "listingPrice-asc",
  },
  {
    label: "oldest listed",
    value: "listingCreatedAt-asc",
  },
]

function sortValueToSortVariable(val: string) {
  if (val === "pertinence") return {}
  const split = val.split("-")
  return {
    [split[0]]: split[1].toUpperCase()
  }
}

interface Props {
  token: GenerativeToken
}

export const GenerativeOffersMarketplace = ({ 
  token,
}: Props) => {
  const [sortValue, setSortValue] = useState<string>("listingCreatedAt-desc")
  const sort = useMemo<Record<string, any>>(() => sortValueToSortVariable(sortValue), [sortValue])

  // use to know when to stop loading
  const currentLength = useRef<number>(0)
  const ended = useRef<boolean>(false)

  const { data, loading, fetchMore, refetch } = useQuery(Qu_genTokListings, {
    notifyOnNetworkStatusChange: true,
    variables: {
      filters: {},
      id: token.id,
      skip: 0,
      take: ITEMS_PER_PAGE,
      sort: sort
    }
  })

  const objkts: Objkt[]|null = data?.generativeToken.activeListedObjkts

  useEffect(() => {
    if (!loading && objkts) {
      if (currentLength.current === objkts.length) {
        ended.current = true
      }
      else {
        currentLength.current = objkts.length
      }
    }
  }, [loading])

  const infiniteScrollFetch = () => {
    !ended.current && fetchMore?.({
      variables: {
        id: token.id,
        skip: objkts?.length || 0,
        take: ITEMS_PER_PAGE,
      },
    })
  }

  useEffect(() => {
    currentLength.current = 0
    ended.current = false
    refetch?.({
      filters: {},
      id: token.id,
      skip: 0,
      take: ITEMS_PER_PAGE,
      sort
    })
  }, [sort])

  return (
    <>
      <div className={cs(style.top_bar)}>
        <Select
          value={sortValue}
          options={sortOptions}
          onChange={setSortValue}
        />
      </div>

      <Spacing size="large" />

      <InfiniteScrollTrigger onTrigger={infiniteScrollFetch} canTrigger={!!data && !loading}>
        <CardsContainer>
          <>
            {objkts && objkts?.length > 0 && objkts.map(objkt => (
              <ObjktCard
                key={objkt.id}
                objkt={objkt}
              />
            ))}
            {loading && (
              <CardsLoading number={ITEMS_PER_PAGE} />
            )}
            {!loading && objkts?.length === 0 && (
              <p>No items currently listed</p>
            )}
          </>
        </CardsContainer>
      </InfiniteScrollTrigger>
    </>
  )
}
