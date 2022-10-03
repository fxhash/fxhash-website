import Link from "next/link"
import Head from "next/head"
import { GetServerSideProps, NextPage } from "next"
import layout from "../../styles/Layout.module.scss"
import text from "../../styles/Text.module.css"
import style from "../../styles/GenerativeTokenDetails.module.scss"
import colors from "../../styles/Colors.module.css"
import cs from "classnames"
import { createApolloClient } from "../../services/ApolloClient"
import { Spacing } from "../../components/Layout/Spacing"
import { UserBadge } from "../../components/User/UserBadge"
import { Button } from "../../components/Button"
import nl2br from "react-nl2br"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import { SectionHeader } from "../../components/Layout/SectionHeader"
import { Activity } from "../../components/Activity/Activity"
import { Objkt } from "../../types/entities/Objkt"
import { User } from "../../types/entities/User"
import { ClientOnlyEmpty } from "../../components/Utils/ClientOnly"
import { UserGuard } from "../../components/Guards/UserGuard"
import { truncateEnd } from "../../utils/strings"
import { TitleHyphen } from "../../components/Layout/TitleHyphen"
import {
  ArtworkIframe,
  ArtworkIframeRef,
} from "../../components/Artwork/PreviewIframe"
import { useContext, useRef, useState } from "react"
import { Features } from "../../components/Features/Features"
import { format } from "date-fns"
import { displayPercentage, displayRoyalties } from "../../utils/units"
import { Qu_objkt } from "../../queries/objkt"
import {
  getGenerativeTokenMarketplaceUrl,
  getGenerativeTokenUrl,
} from "../../utils/generative-token"
import { GenerativeFlagBanner } from "../../containers/Generative/FlagBanner"
import { SettingsContext } from "../../context/Theme"
import { ArtworkFrame } from "../../components/Artwork/ArtworkFrame"
import { EntityBadge } from "../../components/User/EntityBadge"
import { ListSplits } from "../../components/List/ListSplits"
import { gentkLiveUrl } from "../../utils/objkt"
import { Tags } from "../../components/Tags/Tags"
import { ObjktTabs } from "../../containers/Objkt/ObjktTabs"
import { Labels } from "../../components/GenerativeToken/Label/Labels"
import { MarketplaceActions } from "../../containers/Objkt/MarketplaceActions"
import { ListingAccept } from "../../containers/Objkt/ListingAccept"

interface Props {
  objkt: Objkt
}

const ObjktDetails: NextPage<Props> = ({ objkt }) => {
  const owner: User = (
    objkt.activeListing ? objkt.activeListing.issuer : objkt.owner
  )!
  const creator: User = objkt.issuer.author
  const settings = useContext(SettingsContext)
  // get the display url for og:image
  const displayUrl =
    objkt.metadata?.displayUri && ipfsGatewayUrl(objkt.metadata?.displayUri)
  // used to run code if mode image is active
  const [running, setRunning] = useState<boolean>(false)

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
        <meta
          key="og:title"
          property="og:title"
          content={`${objkt.name} — fxhash`}
        />
        <meta
          key="description"
          name="description"
          content={truncateEnd(objkt.metadata?.description || "", 200, "")}
        />
        <meta
          key="og:description"
          property="og:description"
          content={truncateEnd(objkt.metadata?.description || "", 200, "")}
        />
        <meta key="og:type" property="og:type" content="website" />
        <meta
          key="og:image"
          property="og:image"
          content={displayUrl || "https://www.fxhash.xyz/images/og/og1.jpg"}
        />
        <meta name="twitter:site" content="@fx_hash_" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${objkt.name} — fxhash`} />
        <meta
          name="twitter:description"
          content={truncateEnd(objkt.metadata?.description || "", 200, "")}
        />
        <meta
          name="twitter:image"
          content={displayUrl || "https://www.fxhash.xyz/images/og/og1.jpg"}
        />
      </Head>

      <GenerativeFlagBanner token={objkt.issuer} />

      <Spacing size="3x-large" />

      <section className={cs(layout["padding-big"])}>
        <div className={cs(style.artwork_header_mobile, layout.break_words)}>
          <h3>{objkt.name}</h3>
          <Spacing size="regular" />
          <EntityBadge
            prependText="created by"
            user={creator}
            toggeable
            centered
            size="regular"
          />
          <Spacing size="2x-small" />
          <UserBadge prependText="owned by" user={owner} size="regular" />
          <Spacing size="x-large" />
        </div>

        <div className={cs(layout.cols2, layout["responsive-reverse"])}>
          <div className={cs(style["presentation-details"])}>
            <div className={cs(style.artwork_header)}>
              <EntityBadge
                prependText="created by"
                user={creator}
                size="big"
                toggeable
              />
              <Spacing size="2x-small" />
              <UserBadge prependText="owned by" user={owner} size="big" />
              <Spacing size="x-large" />
              <h3>{objkt.name}</h3>
            </div>

            <Spacing size="x-large" />

            <div className={cs(style.buttons)}>
              {objkt.activeListing && (
                <ListingAccept listing={objkt.activeListing} objkt={objkt} />
              )}
              {/* @ts-ignore */}
              <ClientOnlyEmpty style={{ width: "100%" }}>
                <UserGuard forceRedirect={false}>
                  <MarketplaceActions objkt={objkt} />
                </UserGuard>
              </ClientOnlyEmpty>
            </div>

            <Spacing size="regular" />

            <div className={cs(layout.buttons_inline, layout.flex_wrap)}>
              <Link href={getGenerativeTokenUrl(objkt.issuer)} passHref>
                <Button isLink={true} size="regular">
                  open project
                </Button>
              </Link>
              <Link
                href={getGenerativeTokenMarketplaceUrl(objkt.issuer)}
                passHref
              >
                <Button isLink={true} size="regular">
                  open marketplace
                </Button>
              </Link>
            </div>

            <Spacing size="4x-large" />

            <div className={cs(style.buttons)}>
              <strong>
                Project #{objkt.issuer.id} — iteration #{objkt.iteration}
              </strong>
              <span className={cs(text.info)}>
                Minted on{" "}
                {format(new Date(objkt.createdAt), "MMMM d, yyyy' at 'HH:mm")}
              </span>
              <Labels labels={objkt.issuer.labels!} />
            </div>

            <Spacing size="large" />

            <p>{nl2br(objkt.metadata?.description)}</p>

            <Spacing size="2x-large" />

            <div
              className={cs(
                style.buttons,
                layout.break_words,
                style.extra_details
              )}
            >
              <strong>Royalties</strong>
              <span>{displayRoyalties(objkt.royalties)}</span>
              <ListSplits
                name="Royalties split"
                splits={objkt.royaltiesSplit}
              />
              {objkt.features && objkt.features.length > 0 && objkt.rarity && (
                <>
                  <strong>Rarity</strong>
                  <span>
                    {displayPercentage(objkt.rarity)}% (lower is rarer)
                  </span>
                </>
              )}
              <strong>Operation hash</strong>
              <a
                target="_blank"
                rel="noreferrer"
                referrerPolicy="no-referrer"
                href={`https://tzkt.io/${objkt.generationHash}`}
                className={cs(text.very_small)}
              >
                {objkt.generationHash}{" "}
                <i className="fas fa-external-link-square" aria-hidden />
              </a>
              <strong>Metadata</strong>
              {objkt.assigned ? (
                <a
                  target="_blank"
                  referrerPolicy="no-referrer"
                  href={ipfsGatewayUrl(objkt.metadataUri)}
                  rel="noreferrer"
                >
                  view on IPFS{" "}
                  <i className="fas fa-external-link-square" aria-hidden />
                </a>
              ) : (
                <em className={cs(text.info)}>not yet assigned</em>
              )}
            </div>
          </div>

          <div className={cs(style["presentation-artwork"])}>
            <div className={cs(style["preview-container-auto"])}>
              <div className={cs(style["preview-wrapper"])}>
                <ArtworkFrame>
                  {settings.quality === 0 && !running ? (
                    <img src={displayUrl} alt={`${objkt.name} preview`} />
                  ) : (
                    <ArtworkIframe
                      ref={iframeRef}
                      url={gentkLiveUrl(objkt)}
                      hasLoading={false}
                    />
                  )}
                </ArtworkFrame>
              </div>
            </div>

            <Spacing size="8px" />

            <div className={cs(layout["x-inline"])}>
              {settings.quality === 0 && !running ? (
                <Button
                  size="small"
                  color="transparent"
                  iconComp={<i aria-hidden className="fas fa-play" />}
                  iconSide="right"
                  onClick={() => setRunning(true)}
                >
                  run
                </Button>
              ) : (
                <Button
                  size="small"
                  iconComp={<i aria-hidden className="fas fa-redo" />}
                  iconSide="right"
                  onClick={reload}
                  color="transparent"
                >
                  reload
                </Button>
              )}
              <Link href={gentkLiveUrl(objkt)} passHref>
                <Button
                  isLink={true}
                  size="small"
                  iconComp={
                    <i aria-hidden className="fas fa-external-link-square" />
                  }
                  // @ts-ignore
                  target="_blank"
                  color="transparent"
                  iconSide="right"
                >
                  open
                </Button>
              </Link>
            </div>

            {objkt.features && objkt.features.length > 0 && (
              <div className={cs(style.features_wrapper, layout.hide_md)}>
                <Spacing size="3x-large" />
                <h4>Features</h4>
                <Spacing size="small" />
                <Features features={objkt.features} />
              </div>
            )}
          </div>
        </div>

        {objkt.features && objkt.features.length > 0 && (
          <div className={cs(style.features_wrapper, layout.show_md)}>
            <Spacing size="3x-large" />
            <h4>Features</h4>
            <Spacing size="small" />
            <Features features={objkt.features} />
          </div>
        )}
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />

      <ObjktTabs objkt={objkt} />

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let idStr, slug

  if (context.params?.params && context.params.params[0]) {
    if (context.params.params[0] === "slug" && context.params.params[1]) {
      slug = context.params.params[1]
    } else if (context.params.params[0]) {
      idStr = context.params.params[0]
    }
  }
  let variables: Record<string, any> = {},
    token = null

  if (idStr) {
    const id = parseInt(idStr as string)
    if (id === 0 || id) {
      variables.id = id
    }
  } else if (slug) {
    variables.slug = slug
  }

  // only run query if valid variables
  if (Object.keys(variables).length > 0) {
    const apolloClient = createApolloClient()
    const { data } = await apolloClient.query({
      query: Qu_objkt,
      fetchPolicy: "no-cache",
      variables,
    })
    if (data) {
      token = data.objkt
    }
  }

  return {
    props: {
      objkt: token,
    },
    notFound: !token,
  }
}

export default ObjktDetails
