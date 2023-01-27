import style from "./GenerativeListings.module.scss"
import cs from "classnames"
import { useQuery } from "@apollo/client"
import { CardsContainer } from "../../components/Card/CardsContainer"
import { ObjktCard } from "../../components/Card/ObjktCard"
import { useState, useEffect, useMemo, useRef } from "react"
import { Spacing } from "../../components/Layout/Spacing"
import { IOptions, Select } from "../../components/Input/Select"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { Objkt } from "../../types/entities/Objkt"
import { InfiniteScrollTrigger } from "../../components/Utils/InfiniteScrollTrigger"
import { CardsLoading } from "../../components/Card/CardsLoading"
import { Qu_genTokListings } from "../../queries/marketplace"
import { CardsExplorer } from "../../components/Exploration/CardsExplorer"
import { CardSizeSelect } from "../../components/Input/CardSizeSelect"
import { useRouter } from "next/router"
import { buildUrlFromQuery } from "../../utils/url"

const ITEMS_PER_PAGE = 20

const sortOptions: IOptions[] = [
  {
    label: "recently listed",
    value: "listingCreatedAt-desc",
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
    [split[0]]: split[1].toUpperCase(),
  }
}

interface Props {
  token: GenerativeToken
  urlQuery: Record<string, string>
}

const localStorageKey = "marketplace_generative_sort"
const getSortFromUrlQuery = (urlQuery: Record<string, string>) => {
  const { sort } = urlQuery

  // if there is a sort value in the url, pre-select it in the sort input
  // else, select the default value
  const loadSortValueFromLocalStorage = localStorage.getItem(localStorageKey)
  let defaultSortValue =
    sortOptions.find(
      (sortOption) => sortOption.value === loadSortValueFromLocalStorage
    )?.value ?? "listingCreatedAt-desc"
  if (sort) {
    return sortOptions.map(({ value }) => value).includes(sort)
      ? sort
      : defaultSortValue
  }

  return defaultSortValue
}

export const GenerativeListings = ({ token, urlQuery }: Props) => {
  const [sortValue, setSortValue] = useState(getSortFromUrlQuery(urlQuery))
  localStorage.setItem(localStorageKey, sortValue)
  const router = useRouter()
  const sort = useMemo<Record<string, any>>(
    () => sortValueToSortVariable(sortValue),
    [sortValue]
  )

  useEffect(() => {
    const query: any = {}
    query.id = router.query.id
    const sort = encodeURIComponent(sortValue)
    router.push(
      { pathname: router.pathname, query },
      buildUrlFromQuery(router.pathname, { sort: sort }),
      { shallow: true }
    )
  }, [sortValue])

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
      sort: sort,
    },
  })

  const objkts: Objkt[] | null = data?.generativeToken.activeListedObjkts

  useEffect(() => {
    if (!loading && objkts) {
      if (currentLength.current === objkts.length) {
        ended.current = true
      } else {
        currentLength.current = objkts.length
      }
    }
  }, [loading])

  const infiniteScrollFetch = () => {
    !ended.current &&
      fetchMore?.({
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
      sort,
    })
  }, [sort])

  return (
    <CardsExplorer cardSizeScope="marketplace">
      {({ cardSize, setCardSize }) => (
        <>
          <div className={cs(style.top_bar)}>
            <CardSizeSelect value={cardSize} onChange={setCardSize} />
            <Select
              value={sortValue}
              options={sortOptions}
              onChange={setSortValue}
            />
          </div>

          <Spacing size="large" />

          <InfiniteScrollTrigger
            onTrigger={infiniteScrollFetch}
            canTrigger={!!data && !loading}
          >
            <CardsContainer>
              <>
                {objkts &&
                  objkts?.length > 0 &&
                  objkts.map((objkt) => (
                    <ObjktCard key={objkt.id} objkt={objkt} />
                  ))}
                {loading && CardsLoading({
                  number: ITEMS_PER_PAGE,
                })}
                {!loading && objkts?.length === 0 && (
                  <p>No items currently listed</p>
                )}
              </>
            </CardsContainer>
          </InfiniteScrollTrigger>
        </>
      )}
    </CardsExplorer>
  )
}
