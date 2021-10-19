import { GetServerSideProps, NextPage } from "next"
import { Spacing } from "../../components/Layout/Spacing"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { SectionHeader } from "../../components/Layout/SectionHeader"
import ClientOnly from "../../components/Utils/ClientOnly"
import { UserGuard } from "../../components/Guards/UserGuard"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import client from "../../services/ApolloClient"
import { gql } from "@apollo/client"
import { Mint } from "../../containers/Mint/Mint"


interface Props {
  token: GenerativeToken
}

const MintPage: NextPage<Props> = ({ token }) => {
  console.log(token)

  return (
    <>
      <Spacing size="6x-large"/>

      <section>
        <SectionHeader>
          <h2>— mint from <em>{token.name}</em></h2>
        </SectionHeader>

        <Spacing size="x-large"/>

        <main className={cs(layout['padding-big'])}>
          <ClientOnly>
            <UserGuard>
              <Mint token={token} />
            </UserGuard>
          </ClientOnly>
        </main>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const idStr = context.params?.id
  let token = null

  if (idStr) {
    const id = parseInt(idStr as string)
    if (id === 0 || id) {
      const { data, error } = await client.query({
        query: gql`
          query Query($id: Float!) {
            generativeToken(id: $id) {
              id
              name
              metadata
              metadataUri
              price
              supply
              balance
              enabled
              royalties
              author {
                id
                name
                avatarUri
              }
            }
          }
        `,
        fetchPolicy: "no-cache",
        variables: { id }
      })
      if (data) {
        token = data.generativeToken
      }
    }
  }

  return {
    props: {
      token: token,
    },
    notFound: !token
  }
}

export default MintPage