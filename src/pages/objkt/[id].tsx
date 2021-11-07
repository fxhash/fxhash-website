import { gql } from '@apollo/client'
import Link from 'next/link'
import Head from 'next/head'
import { GetServerSideProps, NextPage } from "next"
import layout from "../../styles/Layout.module.scss"
import style from "../../styles/GenerativeTokenDetails.module.scss"
import cs from "classnames"
import client from "../../services/ApolloClient"
import { ArtworkPreview } from '../../components/Artwork/Preview'
import { Spacing } from '../../components/Layout/Spacing'
import { UserBadge } from '../../components/User/UserBadge'
import { Button } from '../../components/Button'
import nl2br from 'react-nl2br'
import { ipfsGatewayUrl } from '../../services/Ipfs'
import { SectionHeader } from '../../components/Layout/SectionHeader'
import { Activity } from '../../components/Activity/Activity'
import { Objkt } from '../../types/entities/Objkt'
import { User } from '../../types/entities/User'
import { ClientOnlyEmpty } from '../../components/Utils/ClientOnly'
import { UserGuard } from '../../components/Guards/UserGuard'
import { OfferControl } from '../../containers/Objkt/OfferControl'
import { Collect } from '../../containers/Objkt/Collect'
import { truncateEnd } from '../../utils/strings'
import { TitleHyphen } from '../../components/Layout/TitleHyphen'
import { ArtworkIframe, ArtworkIframeRef } from '../../components/Artwork/PreviewIframe'
import { useRef } from 'react'
import { Features } from '../../components/Features/Features'
import { format } from 'date-fns'
import { displayPercentage, displayRoyalties } from '../../utils/units'


interface Props {
  objkt: Objkt
}

const ObjktDetails: NextPage<Props> = ({ objkt }) => {
  console.log(objkt)
  const owner: User = (objkt.offer ? objkt.offer.issuer : objkt.owner)!
  const creator: User = objkt.issuer.author
  // get the display url for og:image
  const displayUrl = objkt.metadata?.displayUri && ipfsGatewayUrl(objkt.metadata?.displayUri)

  const iframeRef = useRef<ArtworkIframeRef>(null)
  const reload = () => {
    if (iframeRef.current) {
      iframeRef.current.reloadIframe()
    }
  }

  return (
    <>
      <Head>
        <title>fxhash — {objkt.name}</title>
        <meta key="og:title" property="og:title" content={`fxhash — ${objkt.name}`}/> 
        <meta key="description" name="description" content={truncateEnd(objkt.metadata?.description || "", 200, "")}/>
        <meta key="og:description" property="og:description" content={truncateEnd(objkt.metadata?.description || "", 200, "")}/>
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content={displayUrl || "https://www.fxhash.xyz/images/og/og1.jpg"}/>
      </Head>

      <Spacing size="6x-large" />

      <section className={cs(layout.cols2, layout['responsive-reverse'], layout['padding-big'])}>
        <div className={cs(style['presentation-details'])}>
          <header>
            <h3>{ objkt.name }</h3>
            <Spacing size="x-small"/>
            <UserBadge 
              prependText="created by"
              user={creator}
              size="big"
            />
            <Spacing size="2x-small"/>
            <UserBadge 
              prependText="owned by"
              user={owner}
              size="big"
            />
          </header>

          <Spacing size="large"/>

          <p>{ nl2br(objkt.metadata?.description) }</p>

          <Spacing size="2x-large"/>

          <div className={cs(style['artwork-details'])} style={{ width: "100%" }}>
            <div className={cs(style.buttons)}>
              {objkt.offer && (
                <Collect offer={objkt.offer} />
              )}
              {/* @ts-ignore */}
              <ClientOnlyEmpty style={{ width: "100%" }}>
                <UserGuard forceRedirect={false}>
                  <OfferControl objkt={objkt}/>
                </UserGuard>
              </ClientOnlyEmpty>

              <Link href={`/generative/${objkt.issuer.id}`} passHref>
                <Button
                  isLink={true}
                >
                  see generative token
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className={cs(style['presentation-artwork'])}>
        <div className={cs(style['preview-container-auto'])}>
            <div className={cs(style['preview-wrapper'])}>
              <ArtworkIframe 
                ref={iframeRef}
                url={ipfsGatewayUrl(objkt.metadata?.artifactUri)}
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
            <Link href={ipfsGatewayUrl(objkt.metadata?.artifactUri)} passHref>
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

      <section>
        <SectionHeader>
          <TitleHyphen>gentk details</TitleHyphen>
        </SectionHeader>
        
        <main className={cs(layout['padding-big'], layout.break_words)}>
          <Spacing size="small" />
          <div className={cs(style.buttons)}>
            <span><strong>Minted the:</strong> { format(new Date(objkt.createdAt), "dd/MM/yyyy' at 'HH:mm") }</span>
            <span><strong>Royalties:</strong> { displayRoyalties(objkt.royalties) }</span>
            <span><strong>Metadata assigned:</strong> { objkt.assigned ? "yes" : "no" }</span>
            <span><strong>Transaction hash:</strong> { objkt.generationHash }</span>
            <span><strong>Iteration number:</strong> { objkt.iteration }</span>
            {objkt.features && objkt.features.length > 0 && objkt.rarity && (
              <span><strong>Rarity:</strong> { displayPercentage(objkt.rarity) }% (lower is rarer)</span>
            )}
          </div>

          {objkt.features && objkt.features.length > 0 && (
            <>
              <Spacing size="x-large" />
              <h4>Features</h4>
              <Spacing size="small" />
              <Features features={objkt.features} />
            </>
          )}
        </main>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />

      <section>
        <SectionHeader>
          <TitleHyphen>activity ⚡</TitleHyphen>
        </SectionHeader>

        <Spacing size="3x-large"/>

        <main className={cs(layout['padding-big'])}>
          <div className={cs(style['activity-wrapper'])}>
            <Activity actions={objkt.actions} className={style.activity} />
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
            objkt(id: $id) {
              id
              royalties
              owner {
                id
                name
                avatarUri
              }
              name
              issuer {
                id
                name
                metadata
                author {
                  id
                  name
                  avatarUri
                }
              }
              metadata
              features
              rarity
              assigned
              iteration
              generationHash
              createdAt
              offer {
                id
                price
                issuer {
                  id
                  name
                  avatarUri
                }
              }
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
                  name
                  id
                }
              }
            }
          }
        `,
        fetchPolicy: "no-cache",
        variables: { id }
      })
      if (data) {
        token = data.objkt
      }
    }
  }

  return {
    props: {
      objkt: token,
    },
    notFound: !token
  }
}

export default ObjktDetails