import style from "./Collection.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { CardsContainer } from "../../components/Card/CardsContainer"
import { Spacing } from "../../components/Layout/Spacing"
import { useQuery } from "@apollo/client"
import { Qu_genTokenObjkts } from "../../queries/generative-token"
import { Pagination } from "../../components/Pagination/Pagination"
import { useState, useMemo, useEffect, useRef } from "react"
import { Objkt } from "../../types/entities/Objkt"
import { ObjktCard } from "../../components/Card/ObjktCard"
import { LoaderBlock } from "../../components/Layout/LoaderBlock"
import { CardLoading } from "../../components/Card/CardLoading"
import { CardsLoading } from "../../components/Card/CardsLoading"


const ITEMS_PER_PAGE = 15

interface Props {
  token: GenerativeToken
}

export function GenerativeCollection({ token }: Props) {
  // store the pages fetched
  const fetched = useRef<number[]>([])
  const [page, setPage] = useState<number>(0)

  const { data, loading, fetchMore } = useQuery(Qu_genTokenObjkts, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: token.id,
      skip: 0,
      take: ITEMS_PER_PAGE
    }
  })
  
  // when there's a change in the page, request the data
  useEffect(() => {
    if (!fetched.current.includes(page)) {
      fetchMore({
        variables: {
          id: token.id,
          skip: page * ITEMS_PER_PAGE,
          take: ITEMS_PER_PAGE
        }
      })
    }
  }, [page])


  // derive the active data from the active page
  const objkts: Objkt[]|null = data?.generativeToken.objkts
  const activeObjkts = useMemo<Objkt[]|null>(() => {
    if (!objkts) return null
    // get the start index based on the page
    const startIdx = page * ITEMS_PER_PAGE
    const endIdx = startIdx + ITEMS_PER_PAGE

    // return a sub-portion of the array
    const sub = objkts.slice(startIdx, endIdx)
    // if there are some results, then we can store the page as "saved"
    if (sub.length > 0 && !fetched.current.includes(page)) {
      fetched.current.push(page)
    }
    return sub
  }, [page, data])

  return (
    token.objktsCount > 0 ? (
      <>
        <CardsContainer>
          {loading ? (
            <CardsLoading number={ITEMS_PER_PAGE} />
          ):(
            activeObjkts && activeObjkts.map(objkt => (
              <ObjktCard key={objkt.id} objkt={objkt}/>
            ))
          )}
        </CardsContainer>

        <Spacing size="4x-large"/>

        <div className={cs(layout.x_centered)}>
          <Pagination
            activePage={page}
            itemsCount={token.objktsCount}
            itemsPerPage={15}
            onChange={setPage}
          />
        </div>
      </>
    ):(
      <>
        <p>Nobody has minted from this Generative Token. <strong>Become the first of the collection !</strong></p>
      </>
    )
  )
}