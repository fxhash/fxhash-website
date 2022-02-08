import { GetServerSideProps } from "next"
import { Qu_user } from "../../queries/user"
import { UserAliases } from "../../utils/user"
import client from "../ApolloClient"

export const getServerSidePropsUserByName: GetServerSideProps = async (context) => {
  const name = context.params?.name

  // if there is an alias, query by ID instead
  const userAlias = Object.values(UserAliases).find(alias => alias.name === name)
  const variables = userAlias ? { id: userAlias.id } : { name }

  let user = null

  if (userAlias || (name && name.length > 0)) {
    const { data, error } = await client.query({
      query: Qu_user,
      fetchPolicy: "no-cache",
      variables
    })
    if (data) {
      user = data.user
    }
  }
  return {
    props: {
      user
    },
    notFound: !user
  }
}

export const getServerSidePropsUserById: GetServerSideProps = async (context) => {
  const pkh = context.params?.id
  let user = null

  if (pkh) {
    const { data, error } = await client.query({
      query: Qu_user,
      fetchPolicy: "no-cache",
      variables: { id: pkh }
    })
    if (data) {
      user = data.user
    }
  }
  return {
    props: {
      user
    },
    notFound: !user
  }
}