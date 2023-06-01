import { GetServerSideProps, NextPage } from "next"
import { createApolloClient } from "services/ApolloClient"
import { GenerativeToken } from "types/entities/GenerativeToken"
import { Qu_genToken } from "queries/generative-token"
import { ExploreParams } from "containers/Generative/ExploreParams"
import { isExplorationDisabled } from "utils/generative-token"

interface Props {
  token: GenerativeToken
}

const LiveMintingExploreParams: NextPage<Props> = ({ token }) => {
  return <ExploreParams token={token} mode="live-minting" />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tokenId } = context?.params || {}
  let token = null
  const apolloClient = createApolloClient()
  if (tokenId) {
    const { data } = await apolloClient.query({
      query: Qu_genToken,
      fetchPolicy: "no-cache",
      variables: { id: parseInt(tokenId as string) },
    })
    if (data) {
      token = data.generativeToken
    }
  }

  const disabled = isExplorationDisabled(token)

  if (disabled)
    return {
      redirect: {
        destination: `/generative/${token.id}`,
        permanent: false,
      },
      props: {},
    }

  return {
    props: {
      token: token,
    },
    notFound: !token || token.inputBytesSize === 0,
  }
}

export default LiveMintingExploreParams
