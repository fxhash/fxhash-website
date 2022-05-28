import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { Qu_user } from "../../queries/user"
import { User, UserFlag, UserType } from "../../types/entities/User"
import { isTezosAddress } from "../../utils/strings"
import { UserAliases } from "../../utils/user"
import client from "../ApolloClient"

type ServerSidePropsUserPayload = {
  props: {
    user: User | null
  },
  notFound: boolean
}
export const getServerSidePropsUserByName = async (context: GetServerSidePropsContext): Promise<ServerSidePropsUserPayload> => {
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

export const getServerSidePropsUserById = async (context: GetServerSidePropsContext): Promise<ServerSidePropsUserPayload> => {
  const pkh = context.params?.id
  let user: User|null = null

  if (pkh) {
    const { data, error } = await client.query({
      query: Qu_user,
      fetchPolicy: "no-cache",
      variables: { id: pkh }
    })
    if (data) {
      user = data.user
    }

    // if there's no user in DB, but address is valid we craft a fake user object
    // so that the page doesn't 404
    if (!user && isTezosAddress(pkh as string)) {
      const now = new Date().toISOString()
      user = {
        id: pkh as string,
        description: "This account has not interacted with fxhsh contracts yet.",
        type: UserType.REGULAR,
        authorizations: [],
        flag: UserFlag.NONE,
        generativeTokens: [],
        objkts: [],
        offers: [],
        actionsAsIssuer: [],
        actionsAsTarget: [],
        createdAt: now as any,
        updatedAt: now as any,
        collaborationContracts: [],
      }
    }
  }

  return {
    props: {
      user
    },
    notFound: !user
  }
}
