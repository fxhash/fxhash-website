import { gql } from '@apollo/client'
import Link from 'next/link'
import Head from 'next/head'
import { GetServerSideProps, NextPage } from "next"
import layout from "../../../styles/Layout.module.scss"
import style from "../../../styles/GenerativeTokenDetails.module.scss"
import colors from "../../../styles/Colors.module.css"
import cs from "classnames"
import client from "../../../services/ApolloClient"
import { GenerativeToken } from "../../../types/entities/GenerativeToken"
import { ArtworkPreview } from '../../../components/Artwork/Preview'
import { Spacing } from '../../../components/Layout/Spacing'
import { UserBadge } from '../../../components/User/UserBadge'
import { MintProgress } from '../../../components/Artwork/MintProgress'
import { Button } from '../../../components/Button'
import nl2br from 'react-nl2br'
import { ipfsGatewayUrl } from '../../../services/Ipfs'
import { SectionHeader } from '../../../components/Layout/SectionHeader'
import { CardsContainer } from '../../../components/Card/CardsContainer'
import { ObjktCard } from '../../../components/Card/ObjktCard'
import { Pagination } from '../../../components/Pagination/Pagination'
import { useState } from 'react'
import { Objkt } from '../../../types/entities/Objkt'
import { truncateEnd } from '../../../utils/strings'
import { getGenerativeTokenMarketplaceUrl, getGenerativeTokenUrl } from '../../../utils/generative-token'
import { GenerativeCollection } from '../../../containers/Generative/Collection'


interface Props {
  token: GenerativeToken
}

const GenerativeTokenCollection: NextPage<Props> = ({ token }) => {
  const [visibleObjkts, setVisibleObjkts] = useState<Objkt[]>([])
  const hasCollection = token.objkts?.length > 0

  // get the display url for og:image
  const displayUrl = token.metadata?.displayUri && ipfsGatewayUrl(token.metadata?.displayUri)

  return (
    <>
      <Head>
        <title>fxhash — collection of {token.name}</title>
        <meta key="og:title" property="og:title" content={`${token.name} — collection`}/> 
        <meta key="description" name="description" content={truncateEnd(token.metadata?.description || "", 200, "")}/>
        <meta key="og:description" property="og:description" content={truncateEnd(token.metadata?.description || "", 200, "")}/>
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content={displayUrl || "https://www.fxhash.xyz/images/og/og1.jpg"}/>
        <meta name="twitter:site" content="@fx_hash_"/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content={`${token.name} — collection`}/>
        <meta name="twitter:description" content={truncateEnd(token.metadata?.description || "", 200, "")}/>
        <meta name="twitter:image" content={displayUrl || "https://www.fxhash.xyz/images/og/og1.jpg"}/>
      </Head>

      <Spacing size="6x-large" />

      <section className={cs(style.presentation, style['presentation-small'], layout['padding-big'])}>
        <div className={cs(style['presentation-details'], style.inline)}>
          <header>
            <div className={cs(style['presentation-title'])}>
              <small className={cs(colors.gray)}>#{ token.id }</small>
              <h3>{ token.name }</h3>
              <Spacing size="x-small"/>
              <UserBadge 
                user={token.author}
                size="big"
              />
            </div>
            <div className={cs(style['artwork-details'])}>
              <MintProgress
                balance={token.balance}
                supply={token.supply}
              />
              <Spacing size="large"/>
              <Link href={getGenerativeTokenUrl(token)}>
                <Button isLink={true} size="small">
                  See Generative Token 
                </Button>
              </Link>
              <Spacing size="8px"/>
              <Link href={getGenerativeTokenMarketplaceUrl(token)} passHref>
                <Button isLink={true} size="small">
                  See Marketplace
                </Button>
              </Link>
            </div>
          </header>

          <Spacing size="large"/>

          <p>{ nl2br(token.metadata?.description) }</p>
        </div>

        <div 
          className={cs(style['presentation-artwork'])}
        >
          <ArtworkPreview ipfsUri={token.metadata?.thumbnailUri} />
        </div>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />

      <section>
        <SectionHeader>
          <h2>— Collection ({ token.objktsCount })</h2>
        </SectionHeader>

        <Spacing size="3x-large"/>

        <main className={cs(layout['padding-big'])}>
          <GenerativeCollection
            token={token}
          />
        </main>
      </section>

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
              objktsCount
              createdAt
              updatedAt
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

export default GenerativeTokenCollection