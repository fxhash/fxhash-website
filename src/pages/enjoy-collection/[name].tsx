import { GetServerSideProps, NextPage } from "next"
import cs from "classnames"
import client from "../../services/ApolloClient"
import { User } from '../../types/entities/User'
import { Spacing } from '../../components/Layout/Spacing'
import { Qu_user } from '../../queries/user'
import { UserProfile } from "../../containers/User/UserProfile"
import { getUserName, UserAliases } from "../../utils/user"
import Head from "next/head"
import { useMemo } from "react"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import { truncateEnd } from "../../utils/strings"
import { ClientOnlyEmpty } from "../../components/Utils/ClientOnly"
import { UserCollectionEnjoy } from "../../containers/User/Enjoy/UserCollectionEnjoy"


interface Props {
  user: User
}

const UserCollectionEnjoyPage: NextPage<Props> = ({ user }) => {
  const userImage = user.avatarUri && ipfsGatewayUrl(user.avatarUri)

  return (
    <>
      <Head>
        <title>fxhash — {getUserName(user)} collection gallery</title>
        <meta key="og:title" property="og:title" content={`fxhash — ${getUserName(user)} collection gallery`}/> 
        <meta key="description" property="description" content={truncateEnd(user.metadata?.description || "", 200, "")}/>
        <meta key="og:description" property="og:description" content={truncateEnd(user.metadata?.description || "", 200, "")}/>
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content={userImage || "https://www.fxhash.xyz/images/og/og1.jpg"}/>
      </Head>

      <ClientOnlyEmpty>
        <UserCollectionEnjoy
          user={user}
        />
      </ClientOnlyEmpty>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
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

export default UserCollectionEnjoyPage