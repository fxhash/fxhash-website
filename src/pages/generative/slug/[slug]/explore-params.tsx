import { GetServerSideProps, NextPage } from "next"
import { createApolloClient } from "services/ApolloClient"
import { GenerativeToken } from "types/entities/GenerativeToken"
import { Qu_genToken } from "queries/generative-token"
import { ExploreParams } from "containers/Generative/ExploreParams"
import { isExplorationDisabled } from "utils/generative-token"

interface Props {
  token: GenerativeToken
}

const ExploreParamsFromSlug = ({ token }: Props) => {
  return <ExploreParams token={token} />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context?.params || {}
  let token = null
  const apolloClient = createApolloClient()
  if (slug) {
    const { data } = await apolloClient.query({
      query: Qu_genToken,
      fetchPolicy: "no-cache",
      variables: { slug },
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

export default ExploreParamsFromSlug
