import Link from 'next/link'
import Head from 'next/head'
import { GetServerSideProps, NextPage } from "next"
import layout from "../../../styles/Layout.module.scss"
import style from "./GenerativeTokenMarketplace.module.scss"
import colors from "../../../styles/Colors.module.css"
import homeStyle from "../../../styles/Home.module.scss"
import cs from "classnames"
import client from "../../../services/ApolloClient"
import { GenerativeToken, GenTokFlag } from "../../../types/entities/GenerativeToken"
import { Spacing } from '../../../components/Layout/Spacing'
import { UserBadge } from '../../../components/User/UserBadge'
import { MintProgress } from '../../../components/Artwork/MintProgress'
import { Button } from '../../../components/Button'
import nl2br from 'react-nl2br'
import { displayMutez, displayRoyalties } from '../../../utils/units'
import { ipfsGatewayUrl } from '../../../services/Ipfs'
import { SectionHeader } from '../../../components/Layout/SectionHeader'
import { CardsContainer } from '../../../components/Card/CardsContainer'
import { ObjktCard } from '../../../components/Card/ObjktCard'
import ClientOnly from '../../../components/Utils/ClientOnly'
import { EditTokenSnippet } from '../../../containers/Token/EditTokenSnippet'
import { UserGuard } from '../../../components/Guards/UserGuard'
import { truncateEnd } from '../../../utils/strings'
import { TitleHyphen } from '../../../components/Layout/TitleHyphen'
import { ArtworkIframe, ArtworkIframeRef } from '../../../components/Artwork/PreviewIframe'
import { useRef, useState } from 'react'
import { Qu_genToken, Qu_genTokenMarketplace } from '../../../queries/generative-token'
import { GenerativeActions } from '../../../containers/Generative/Actions'
import { GenerativeExtraActions } from '../../../containers/Generative/ExtraActions'
import { FlagBanner } from '../../../containers/Generative/FlagBanner'
import { Unlock } from '../../../components/Utils/Unlock'
import { format } from 'date-fns'
import { ArtworkPreview } from '../../../components/Artwork/Preview'
import { getGenerativeTokenUrl } from '../../../utils/generative-token'


interface Props {
  token: GenerativeToken
}

const GenerativeTokenMarketplace: NextPage<Props> = ({ token }) => {
  const hasCollection = token.objkts?.length > 0
  const collectionUrl = `/generative/${token.id}/collection`

  // get the display url for og:image
  const displayUrl = token.metadata?.displayUri && ipfsGatewayUrl(token.metadata?.displayUri)

  return (
    <>
      <Head>
        <title>fxhash — marketplace / {token.name}</title>
        <meta key="og:title" property="og:title" content={`fxhash — marketplace / ${token.name}`}/> 
        <meta key="description" name="description" content={truncateEnd(token.metadata?.description || "", 200, "")}/>
        <meta key="og:description" property="og:description" content={truncateEnd(token.metadata?.description || "", 200, "")}/>
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content={displayUrl || "https://www.fxhash.xyz/images/og/og1.jpg"}/>
      </Head>

      <FlagBanner token={token}/>

      <Spacing size="6x-large" />

      <section className={cs(style.presentation, layout['padding-big'])}>        
        <header className={cs(style.presentation_header)}>
          <div className={cs(style.preview_wrapper)}>
            <ArtworkPreview ipfsUri={token.metadata?.thumbnailUri} />
          </div>
          <div className={cs(style.presentation_details)}>
            <small className={cs(colors.gray)}>#{ token.id }</small>
            <h3>{ token.name }</h3>
            <Spacing size="3x-small"/>
            <UserBadge 
              user={token.author}
              size="regular"
            />
            <Spacing size="small"/>
            <div className={cs(style.artwork_details)}>
              <MintProgress
                balance={token.balance}
                supply={token.supply}
              />
              <Spacing size="x-small"/>
              <Link href={getGenerativeTokenUrl(token)}>
                <Button isLink={true} size="small">
                  See Generative Token 
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <Spacing size="3x-large" />

        <div className={cs(style.metrics)}>
          <article className={cs(style.metric)}>
            <span>1st sales</span>
            <strong>{ token.marketStats?.primTotal ? `${displayMutez(token.marketStats.primTotal)} tez` : "/" }</strong>
          </article>
          <article className={cs(style.metric)}>
            <span>2nd sales (tez)</span>
            <strong>{ token.marketStats?.secVolumeTz ? `${displayMutez(token.marketStats.secVolumeTz)} tez` : "/" }</strong>
          </article>
          <article className={cs(style.metric)}>
            <span>2nd sales (nb)</span>
            <strong>{ token.marketStats?.secVolumeNb ? token.marketStats.secVolumeNb : "/" }</strong>
          </article>
          <article className={cs(style.metric)}>
            <span>2nd sales 24h (tez)</span>
            <strong>{ token.marketStats?.secVolumeTz24 ? `${displayMutez(token.marketStats.secVolumeTz24)} tez` : "/" }</strong>
          </article>
          <article className={cs(style.metric)}>
            <span>2nd sales 24h (nb)</span>
            <strong>{ token.marketStats?.secVolumeTz24 ? token.marketStats.secVolumeNb24 : "/" }</strong>
          </article>
          <article className={cs(style.metric)}>
            <span>Items for sale</span>
            <strong>{ token.marketStats?.totalListing || "0" }</strong>
          </article>
          <article className={cs(style.metric)}>
            <span>Lowest 2nd sale</span>
            <strong>{ token.marketStats?.lowestSold ? `${displayMutez(token.marketStats.lowestSold)} tez` : "/" }</strong>
          </article>
          <article className={cs(style.metric)}>
            <span>Highest 2nd sale</span>
            <strong>{ token.marketStats?.highestSold ? `${displayMutez(token.marketStats.highestSold)} tez` : "/" }</strong>
          </article>
          <article className={cs(style.metric)}>
            <span>Floor</span>
            <strong>{ token.marketStats?.floor ? `${displayMutez(token.marketStats.floor)} tez` : "/" }</strong>
          </article>
          <article className={cs(style.metric)}>
            <span>Median</span>
            <strong>{ token.marketStats?.median ? `${displayMutez(token.marketStats.median)} tez` : "/" }</strong>
          </article>
        </div>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let idStr = context.params?.id
  let token: GenerativeToken|null = null

  if (idStr) {
    const id = parseInt(idStr as string)
    if (id === 0 || id) {
      const { data } = await client.query({
        query: Qu_genTokenMarketplace,
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

export default GenerativeTokenMarketplace