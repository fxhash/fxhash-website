import { GetServerSideProps, NextPage } from "next"
import { SectionHeader } from "../../../components/Layout/SectionHeader"
import { Spacing } from "../../../components/Layout/Spacing"
import ClientOnly from "../../../components/Utils/ClientOnly"
import layout from "../../../styles/Layout.module.scss"
import style from "./index.module.scss"
import cs from "classnames"
import { UserGuard } from "../../../components/Guards/UserGuard"
import Head from "next/head"
import { Collaboration, User, UserType } from "../../../types/entities/User"
import client from "../../../services/ApolloClient"
import { Qu_collaboration } from "../../../queries/user"
import { SectionTitle } from "../../../components/Layout/SectionTitle"
import { UserBadge } from "../../../components/User/UserBadge"
import { CollaborationManager } from "../../../containers/Collaborations/CollaborationManager"

interface Props {
  collaboration: Collaboration
}

const CollaborationIndex: NextPage<Props> = ({ collaboration }) => {
  return (
    <>
      <Head>
        <title>fxhash — collaboration</title>
        <meta
          key="description"
          name="description"
          content="A page to consult and manage the state of a collaboration contract."
        />
      </Head>

      <Spacing size="6x-large" />

      <section>
        <SectionHeader layout="center">
          <SectionTitle>Manage collaboration</SectionTitle>
        </SectionHeader>

        <Spacing size="x-small" />

        <div className={cs(style.users, layout["padding-big"])}>
          {collaboration.collaborators.map((user) => (
            <UserBadge key={user.id} user={user} />
          ))}
        </div>

        <Spacing size="6x-large" />

        <ClientOnly>
          <UserGuard
            allowed={(user) =>
              !!collaboration.collaborators.find((c) => c.id === user.id)
            }
          >
            <CollaborationManager collaboration={collaboration} />
          </UserGuard>
        </ClientOnly>
      </section>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.address
  let collab: Collaboration | null = null

  if (id) {
    const { data } = await client.query({
      query: Qu_collaboration,
      fetchPolicy: "no-cache",
      variables: { id },
    })
    collab = data.user
  }

  return {
    props: {
      collaboration: collab,
    },
    notFound: !collab || collab.type !== UserType.COLLAB_CONTRACT_V1,
  }
}

export default CollaborationIndex
