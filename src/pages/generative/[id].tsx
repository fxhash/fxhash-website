import { gql } from '@apollo/client'
import Link from 'next/link'
import Head from 'next/head'
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
import { UserGuard } from '../../components/Guards/UserGuard'
import { truncateEnd } from '../../utils/strings'
import { TitleHyphen } from '../../components/Layout/TitleHyphen'
import { ArtworkIframe, ArtworkIframeRef } from '../../components/Artwork/PreviewIframe'
import { getIpfsIoUrl, getPinataUrlFromCid, ipfsUrlToCid } from '../../utils/ipfs'
import { useRef } from 'react'


interface Props {
  token: GenerativeToken
}

const GenerativeTokenDetails: NextPage<Props> = ({ token }) => {
  const hasCollection = token.objkts?.length > 0
  const collectionUrl = `/generative/${token.id}/collection`
  const iframeRef = useRef<ArtworkIframeRef>(null)

  const reload = () => {
    if (iframeRef.current) {
      iframeRef.current.reloadIframe()
    }
  }

  // get the display url for og:image
  const displayUrl = token.metadata?.displayUri && ipfsDisplayUrl(token.metadata?.displayUri)

  return (
    <>
      <Head>
        <title>fxhash — {token.name}</title>
        <meta key="og:title" property="og:title" content={`fxhash — ${token.name}`}/> 
        <meta key="description" name="description" content={truncateEnd(token.metadata?.description || "", 200, "")}/>
        <meta key="og:description" property="og:description" content={truncateEnd(token.metadata?.description || "", 200, "")}/>
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content={displayUrl || "https://www.fxhash.xyz/images/og/og1.jpg"}/>
      </Head>

      <Spacing size="6x-large" />

      <section className={cs(style.presentation, layout.cols2, layout['responsive-reverse'], layout['padding-big'])}>
        <div className={cs(style['presentation-details'])}>
          <header>
            <h3>{ token.name }</h3>
            <Spacing size="x-small"/>
            <UserBadge 
              user={token.author}
              size="big"
            />
            <ClientOnly>
              <UserGuard forceRedirect={false}>
                <EditTokenSnippet token={token} />
              </UserGuard>
            </ClientOnly>
          </header>

          <Spacing size="large"/>

          <p>{ nl2br(token.metadata?.description) }</p>

          <Spacing size="2x-large"/>

          <div className={cs(style['artwork-details'])}>
            <MintProgress
              balance={token.balance}
              supply={token.supply}
            />
            <Spacing size="large"/>
            
            {token.balance > 0 && (
              <>
                {!token.enabled && <small>token is currently <strong>disabled</strong></small>}
                <Link href={`/mint/${token.id}`} passHref>
                  <Button
                    isLink
                    color="secondary"
                    disabled={!token.enabled}
                  >
                    Mint unique token — {displayMutez(token.price)} tez
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className={cs(style['presentation-artwork'])}>
          {/* <ArtworkPreview ipfsUri={token.metadata?.displayUri} /> */}
          <div className={cs(style['preview-container-auto'])}>
            <div className={cs(style['preview-wrapper'])}>
              <ArtworkIframe 
                ref={iframeRef}
                url={getIpfsIoUrl(ipfsUrlToCid(token.metadata.artifactUri))}
              />
            </div>
          </div>

          <Spacing size="8px"/>

          <div className={cs(layout['x-inline'])}>
            <Button
              size="small"
              iconComp={<i aria-hidden className="fas fa-redo"/>}
              iconSide="right"
              onClick={reload}
            >
              reload
            </Button>
            <Link href={ipfsDisplayUrl(token.metadata?.artifactUri)} passHref>
              <Button
                isLink={true}
                size="small"
                iconComp={<i aria-hidden className="fas fa-external-link-alt"></i>}
                // @ts-ignore
                target="_blank"
              >
                open live
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />

      <section>
        <SectionHeader>
          <TitleHyphen>latest tokens minted</TitleHyphen>
          {hasCollection && (
            <Link href={collectionUrl}>
              <a>view entire collection &gt;</a>
            </Link>
          )}
        </SectionHeader>

        <Spacing size="3x-large"/>

        <main className={cs(layout['padding-big'])}>
          {hasCollection ? (
            <>
              <CardsContainer className={cs(homeStyle['row-responsive-limiter'])}>
                {token.objkts.slice(0, 5).map(objkt => (
                  <ObjktCard key={objkt.id} objkt={objkt}/>
                ))}
              </CardsContainer>
              <Spacing size="4x-large"/>
              <div className={cs(style['view-collection-container'])}>
                <Link href={collectionUrl} passHref>
                  <Button isLink={true}>view entire collection</Button>
                </Link>
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

      <section>
        <SectionHeader>
          <h2>— Recent activity ⚡</h2>
        </SectionHeader>

        <Spacing size="3x-large"/>

        <main className={cs(layout['padding-big'])}>
          <div className={cs(style['activity-wrapper'])}>
            <Activity actions={token.actions} className={style.activity} />
          </div>
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
                issuer {
                  author {
                    id
                    name
                    avatarUri
                  }
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
                token {
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

export default GenerativeTokenDetails