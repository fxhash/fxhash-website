import { gql } from '@apollo/client'
import Link from 'next/link'
import { GetServerSideProps, NextPage } from "next"
import layout from "../../styles/Layout.module.scss"
import style from "../../styles/GenerativeTokenDetails.module.scss"
import homeStyle from "../../styles/Home.module.scss"
import cs from "classnames"
import client from "../../services/ApolloClient"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { ArtworkPreview } from '../../components/Artwork/Preview'
import { Spacing } from '../../components/Layout/Spacing'
import { UserBadge } from '../../components/User/UserBadge'
import { MintProgress } from '../../components/Artwork/MintProgress'
import { Button } from '../../components/Button'
import nl2br from 'react-nl2br'
import { displayMutez } from '../../utils/units'
import { ipfsDisplayUrl } from '../../services/Ipfs'
import { SectionHeader } from '../../components/Layout/SectionHeader'
import { CardsContainer } from '../../components/Card/CardsContainer'
import { ObjktCard } from '../../components/Card/ObjktCard'
import { Activity } from '../../components/Activity/Activity'
import ClientOnly from '../../components/Utils/ClientOnly'
import { EditTokenSnippet } from '../../containers/Token/EditTokenSnippet'
import { EditToken } from '../../containers/Token/EditToken'
import { UserGuard } from '../../components/Guards/UserGuard'


interface Props {
  token: GenerativeToken
}

const EditGenerative: NextPage<Props> = ({ token }) => {
  return (
    <>
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
    if (id) {
      const { data, error } = await client.query({
        query: gql`
          query Query($id: Float!) {
            generativeToken(id: $id) {
              id
              name
              metadata
              price
              enabled
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