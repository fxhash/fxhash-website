import { gql } from '@apollo/client'
import Head from 'next/head'
import { GetServerSideProps, NextPage } from "next"
import client from "../../services/ApolloClient"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { Spacing } from '../../components/Layout/Spacing'
import ClientOnly from '../../components/Utils/ClientOnly'
import { EditToken } from '../../containers/Token/EditToken'
import { UserGuard } from '../../components/Guards/UserGuard'
import { truncateEnd } from '../../utils/strings'


interface Props {
  token: GenerativeToken
}

const EditGenerative: NextPage<Props> = ({ token }) => {
  return (
    <>
      <Head>
        <title>fxhash — edit {token.name}</title>
        <meta key="description" name="description" content={truncateEnd(token.metadata?.description || "", 200, "")}/>
      </Head>

      <Spacing size="6x-large" />

      <ClientOnly>
        <UserGuard>
          <EditToken token={token} />
        </UserGuard>
      </ClientOnly> 
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
              price
              enabled
              supply
              originalSupply
              balance
              royalties
              author {
                id
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

export default EditGenerative