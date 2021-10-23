import { gql } from '@apollo/client'
import Link from 'next/link'
import Head from 'next/head'
import { GetServerSideProps, NextPage } from "next"
import layout from "../../../styles/Layout.module.scss"
import style from "../../../styles/GenerativeTokenDetails.module.scss"
import cs from "classnames"
import client from "../../../services/ApolloClient"
import { GenerativeToken } from "../../../types/entities/GenerativeToken"
import { ArtworkPreview } from '../../../components/Artwork/Preview'
import { Spacing } from '../../../components/Layout/Spacing'
import { UserBadge } from '../../../components/User/UserBadge'
import { MintProgress } from '../../../components/Artwork/MintProgress'
import { Button } from '../../../components/Button'
import nl2br from 'react-nl2br'
import { ipfsDisplayUrl } from '../../../services/Ipfs'
import { SectionHeader } from '../../../components/Layout/SectionHeader'
import { CardsContainer } from '../../../components/Card/CardsContainer'
import { ObjktCard } from '../../../components/Card/ObjktCard'
import { Pagination } from '../../../components/Pagination/Pagination'
import { useState } from 'react'
import { Objkt } from '../../../types/entities/Objkt'
import { truncateEnd } from '../../../utils/strings'


interface Props {
  token: GenerativeToken
}

const GenerativeTokenCollection: NextPage<Props> = ({ token }) => {
  const [visibleObjkts, setVisibleObjkts] = useState<Objkt[]>([])
  const hasCollection = token.objkts?.length > 0

  // get the display url for og:image
  const displayUrl = token.metadata?.displayUri && ipfsDisplayUrl(token.metadata?.displayUri)

  return (
    <>
      <Head>
        <title>fxhash — collection of {token.name}</title>
        <meta key="og:title" property="og:title" content={`fxhash — collection of ${token.name}`}/> 
        <meta key="description" property="description" content={truncateEnd(token.metadata?.description || "", 200, "")}/>
        <meta key="og:description" property="og:description" content={truncateEnd(token.metadata?.description || "", 200, "")}/>
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content={displayUrl || "/images/og/og1.jpg"}/>
      </Head>

      <Spacing size="6x-large" />

      <section className={cs(style.presentation, style['presentation-small'], layout['padding-big'])}>
        <div className={cs(style['presentation-details'], style.inline)}>
          <header>
            <div className={cs(style['presentation-title'])}>
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
              <Link href={`/generative/${token.id}`}>
                <Button isLink={true} size="small">
                  See Generative Token
                </Button>
              </Link>
            </div>
          </header>

          <Spacing size="large"/>

          <p>{ nl2br(token.metadata?.description) }</p>
        </div>

        <div 
          className={cs(style['presentation-artwork'])}
          style={{
            width: "auto"
          }}
        >
          <ArtworkPreview ipfsUri={token.metadata?.displayUri} />
        </div>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />

      <section>
        <SectionHeader>
          <h2>— Collection ({ token.objkts.length })</h2>
        </SectionHeader>

        <Spacing size="3x-large"/>

        <main className={cs(layout['padding-big'])}>
          {hasCollection ? (
            <>
              <CardsContainer>
                {visibleObjkts.map(objkt => (
                  <ObjktCard key={objkt.id} objkt={objkt}/>
                ))}
              </CardsContainer>
              <Spacing size="4x-large"/>

              <div className={cs(style['view-collection-container'])}>
                <Pagination
                  items={token.objkts}
                  itemsPerPage={12}
                  onChange={setVisibleObjkts}
                />
              </div>
            </>
          ):(
            <>
              <p>Nobody has minted from this Generative Token. <strong>Become the first of the collection !</strong></p>
            </>
          )}
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
              objkts {
                id
                owner {
                  id
                  name
                  avatarUri
                }
                name
                metadata
                offer {
                  issuer {
                    id
                    name
                    avatarUri
                  }
                  price
                }
              }
              createdAt
              updatedAt
              actions {
                id
                type
                metadata
                createdAt
                issuer {
                  id
                  name
                  avatarUri
                }
                target {
                  id
                  name
                  avatarUri
                }
                objkt {
                  id
                  name
                }
              }
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