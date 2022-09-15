import { NextPage } from "next"
import { User } from '../../../../types/entities/User'
import { getUserName } from "../../../../utils/user"
import Head from "next/head"
import { ipfsGatewayUrl } from "../../../../services/Ipfs"
import { truncateEnd } from "../../../../utils/strings"
import { ClientOnlyEmpty } from "../../../../components/Utils/ClientOnly"
import { UserCollectionEnjoy } from "../../../../containers/User/Enjoy/UserCollectionEnjoy"
import { getServerSidePropsUserByName } from "../../../../services/ServerSideProps/ServerSidePropsUser"


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

export const getServerSideProps = getServerSidePropsUserByName

export default UserCollectionEnjoyPage