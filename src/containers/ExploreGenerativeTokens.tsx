import { gql, useQuery } from '@apollo/client'
import { GenerativeToken } from '../types/entities/GenerativeToken'
import { CardsContainer } from '../components/Card/CardsContainer'
import { GenerativeTokenCard } from '../components/Card/GenerativeTokenCard'
import { LoaderBlock } from '../components/Layout/LoaderBlock'
import { InfiniteScrollTrigger } from '../components/Utils/InfiniteScrollTrigger'


const ITEMS_PER_PAGE = 10

const Qu_genTokens = gql`
query Query ($skip: Int, $take: Int) {
  generativeTokens(skip: $skip, take: $take) {
    id
    name
    metadata
    price
    supply
    balance
    enabled
    royalties
    createdAt
    updatedAt
    author {
      id
      name
      avatarUri
    }
  }
}`

interface Props {
}

export const ExploreGenerativeTokens = ({}: Props) => {
  const { data, loading, fetchMore } = useQuery(Qu_genTokens, {
    variables: {
      skip: 0,
      take: ITEMS_PER_PAGE
    }
  })

  const infiniteScrollFetch = () => {
    fetchMore({
      variables: {
        skip: data.generativeTokens.length,
        take: ITEMS_PER_PAGE
      }
    })
  }

  const generativeTokens: GenerativeToken[] = data?.generativeTokens

  return (
    <>
      {loading ? (
        <LoaderBlock height="30vh">loading</LoaderBlock>
      ):(
       <InfiniteScrollTrigger onTrigger={infiniteScrollFetch}>
        <CardsContainer>
          {generativeTokens.map(token => (
            <GenerativeTokenCard key={token.id} token={token}/>
          ))}
        </CardsContainer>
       </InfiniteScrollTrigger>
      )}
    </>
  )
}
