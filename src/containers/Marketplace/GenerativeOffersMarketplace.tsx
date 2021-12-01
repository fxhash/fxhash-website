import style from "./GenerativeOffersMarketplace.module.scss"
import cs from "classnames"
import { gql, useLazyQuery, useQuery } from '@apollo/client'
import { CardsContainer } from '../../components/Card/CardsContainer'
import { ObjktCard } from '../../components/Card/ObjktCard'
import { LoaderBlock } from '../../components/Layout/LoaderBlock'
import { useState, useEffect, useMemo } from 'react'
import { Spacing } from '../../components/Layout/Spacing'
import { IOptions, Select } from '../../components/Input/Select'
import { GenerativeToken } from '../../types/entities/GenerativeToken'
import { Objkt } from '../../types/entities/Objkt'


const ITEMS_PER_PAGE = 20

const Qu_offers = gql`
  query Query($id: Float!, $filters: ObjktFilter, $offerPrice: String, $offerCreatedAt: String) {
    generativeToken(id: $id) {
      id
      objkts(filters: $filters, offerPrice: $offerPrice, offerCreatedAt: $offerCreatedAt) {
        id
        name
        slug
        metadata
        offer {
          id
          price
          issuer {
            id
            name
            avatarUri
          }
        }
        owner {
          id
          name
          avatarUri
        }
        issuer {
          flag
          author {
            id
            name
            avatarUri
          }
        }
      }
    }
  }
`

const sortOptions: IOptions[] = [
  {
    label: "recently listed",
    value: "offerCreatedAt-desc"
  },
  {
    label: "price (high to low)",
    value: "offerPrice-desc",
  },
  {
    label: "price (low to high)",
    value: "offerPrice-asc",
  },
  {
    label: "oldest listed",
    value: "offerCreatedAt-asc",
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
  const [sortValue, setSortValue] = useState<string>("createdAt-desc")
  const sortVariables = useMemo<Record<string, any>>(() => sortValueToSortVariable(sortValue), [sortValue])

  const { data, loading, fetchMore, refetch } = useQuery(Qu_offers, {
    variables: {
      filters: {
        offer_ne: null
      },
      id: token.id,
      // skip: 0,
      // take: ITEMS_PER_PAGE,
      ...sortVariables
    }
  })

  // const infiniteScrollFetch = () => {
  //   fetchMore?.({
  //     variables: {
  //       skip: data.offers.length,
  //       take: ITEMS_PER_PAGE,
  //     },
  //   })
  // }

  const objkts: Objkt[] = data?.generativeToken.objkts

  useEffect(() => {
    refetch?.({
      // skip: 0,
      // take: ITEMS_PER_PAGE,
      ...sortVariables
    })
  }, [sortVariables])

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



      {loading ? (
        <LoaderBlock height="100px">loading</LoaderBlock>
      ):(
        (objkts?.length > 0) ? (
          <CardsContainer>
            {objkts.map(objkt => (
              <ObjktCard key={objkt.id} objkt={objkt}/>
            ))}
          </CardsContainer>
        ):(
          <p>No items currently listed</p>
        )
      )}
    </>
  )
}
