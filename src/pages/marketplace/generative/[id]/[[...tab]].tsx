import Link from "next/link"
import Head from "next/head"
import { GetServerSideProps, NextPage } from "next"
import layout from "../../../../styles/Layout.module.scss"
import style from "../GenerativeTokenMarketplace.module.scss"
import colors from "../../../../styles/Colors.module.css"
import styleActivity from "../../../../styles/Activity.module.scss"
import cs from "classnames"
import { InlineTokenCard } from "components/Views/InlineTokenCard"
import { createApolloClient } from "../../../../services/ApolloClient"
import { GenerativeToken } from "../../../../types/entities/GenerativeToken"
import { Spacing } from "../../../../components/Layout/Spacing"
import { MintProgress } from "../../../../components/Artwork/MintProgress"
import { Button } from "../../../../components/Button"
import { ClientOnlyEmpty } from "../../../../components/Utils/ClientOnly"
import { truncateEnd } from "../../../../utils/strings"
import { Qu_genTokenMarketplace } from "../../../../queries/generative-token"
import { GenerativeActions } from "../../../../containers/Generative/Actions"
import { GenerativeFlagBanner } from "../../../../containers/Generative/FlagBanner"
import { ArtworkPreview } from "../../../../components/Artwork/Preview"
import { getGenerativeTokenUrl } from "../../../../utils/generative-token"
import { TabDefinition } from "../../../../components/Layout/Tabs"
import { DisplayTezos } from "../../../../components/Display/DisplayTezos"
import { GenerativeStatsMarketplace } from "../../../../containers/Marketplace/GenerativeStatsMarketplace"
import { TokenActionType } from "../../../../types/entities/Action"
import { EntityBadge } from "../../../../components/User/EntityBadge"
import { TabsContainer } from "../../../../components/Layout/TabsContainer"
import { GenerativeListings } from "../../../../containers/Marketplace/GenerativeListings"
import { GenerativeOffers } from "../../../../containers/Marketplace/GenerativeOffers"
import { getImageApiUrl, OG_IMAGE_SIZE } from "../../../../components/Image"
import { ButtonCollectionOfferCreate } from "containers/Objkt/ButtonCollectionOfferCreate"
import { useRouter } from "next/router"
import { GenerativeMintTickets } from "containers/Generative/GenerativeMintTickets"
import { useMemo } from "react"

interface Props {
  token: GenerativeToken
  tab: typeof tabs[number]["name"]
}

const tabs: TabDefinition[] = [
  {
    name: "listed",
  },
  {
    name: "offers",
  },
  {
    name: "stats",
  },
  {
    name: "activity",
  },
]

const marketplaceComponents = {
  listed: GenerativeListings,
  ["offers"]: GenerativeOffers,
  ["tickets"]: GenerativeMintTickets,
  ["stats"]: GenerativeStatsMarketplace,
  activity: GenerativeActions,
}
export const marketplaceComponentsKeys = Object.keys(marketplaceComponents)

const actionTypeFilters: TokenActionType[] = [
  TokenActionType.LISTING_V1_ACCEPTED,
  TokenActionType.LISTING_V2_ACCEPTED,
  TokenActionType.COLLECTION_OFFER_ACCEPTED,
  TokenActionType.OFFER_ACCEPTED,
  TokenActionType.AUCTION_FULFILLED,
  TokenActionType.TICKED_CLAIMED,
]

const actionFilters = {
  type_in: actionTypeFilters,
}

const GenerativeTokenMarketplace: NextPage<Props> = ({ token, tab }) => {
  const router = useRouter()

  // get the display url for og:image
  const displayUrl =
    token.captureMedia?.cid &&
    getImageApiUrl(token.captureMedia.cid, OG_IMAGE_SIZE)

  const usesParams = !!token.inputBytesSize

  const { tabs, tabIndexes } = useMemo(() => {
    const tabs = [
      {
        name: "listed",
      },
      ...(usesParams ? [{ name: "tickets" }] : []),
      {
        name: "offers",
      },
      {
        name: "stats",
      },
      {
        name: "activity",
      },
    ]

    const tabIndexes = tabs.reduce((acc, tab, index) => {
      acc[tab.name] = index
      return acc
    }, {} as Record<string, number>)

    return { tabs, tabIndexes }
  }, [usesParams])

  return (
    <>
      <Head>
        <title>fxhash — marketplace / {token.name}</title>
        <meta
          key="og:title"
          property="og:title"
          content={`marketplace — ${token.name} — fxhash`}
        />
        <meta
          key="description"
          name="description"
          content={truncateEnd(token.metadata?.description || "", 200, "")}
        />
        <meta
          key="og:description"
          property="og:description"
          content={truncateEnd(token.metadata?.description || "", 200, "")}
        />
        <meta key="og:type" property="og:type" content="website" />
        <meta
          key="og:image"
          property="og:image"
          content={displayUrl || "https://www.fxhash.xyz/images/og/og1.jpg"}
        />
        <meta name="twitter:site" content="@fx_hash_" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`marketplace — ${token.name} — fxhashcollection`}
        />
        <meta
          name="twitter:description"
          content={truncateEnd(token.metadata?.description || "", 200, "")}
        />
        <meta
          name="twitter:image"
          content={displayUrl || "https://www.fxhash.xyz/images/og/og1.jpg"}
        />
      </Head>

      <GenerativeFlagBanner token={token} />

      <Spacing size="3x-large" sm="x-large" />

      <section className={cs(style.presentation, layout["padding-big"])}>
        <InlineTokenCard
          ipfsUri={token.metadata?.thumbnailUri}
          image={token.captureMedia}
          identifier={`#${token.id}`}
          title={token.name}
          author={token.author}
        >
          <div className={cs(style.progress_container)}>
            <MintProgress token={token} />
          </div>
          <div className={cs(style.presentation_details)}>
            <small className={cs(colors.gray, style.token_id)}>
              #{token.id}
            </small>
            <h3>{token.name}</h3>
            <Spacing size="3x-small" sm="x-small" />
            <EntityBadge
              classNameAvatar={style.avatar}
              user={token.author}
              size="regular"
              toggeable
            />
            <Spacing size="small" />
            <div className={cs(style.artwork_details)}>
              <div className={cs(style.progress_container)}>
                <MintProgress token={token} />
              </div>
              <Spacing size="small" sm="regular" />
              <Link href={getGenerativeTokenUrl(token)} passHref>
                <Button isLink={true} className={style.button} size="small">
                  open project page
                </Button>
              </Link>
              <Spacing size="x-small" sm="regular" />
              <ButtonCollectionOfferCreate
                token={token}
                floor={token.marketStats?.floor}
              />
            </div>
          </div>
        </header>

        <Spacing size="3x-large" />

        <div className={cs(style.metrics)}>
          <article className={cs(style.metric)}>
            <span>1st sales</span>
            <strong>
              {token.marketStats?.primVolumeTz != null ? (
                <DisplayTezos mutez={token.marketStats.primVolumeTz} />
              ) : (
                "/"
              )}
            </strong>
          </article>
          <article className={cs(style.metric)}>
            <span>2nd sales (tez)</span>
            <strong>
              {token.marketStats?.secVolumeTz != null ? (
                <DisplayTezos mutez={token.marketStats.secVolumeTz} />
              ) : (
                "/"
              )}
            </strong>
          </article>
          <article className={cs(style.metric)}>
            <span>2nd sales (nb)</span>
            <strong>
              {token.marketStats?.secVolumeNb
                ? token.marketStats.secVolumeNb
                : "/"}
            </strong>
          </article>
          <article className={cs(style.metric)}>
            <span>2nd sales 24h (tez)</span>
            <strong>
              {token.marketStats?.secVolumeTz24 ? (
                <DisplayTezos mutez={token.marketStats.secVolumeTz24} />
              ) : (
                "/"
              )}
            </strong>
          </article>
          <article className={cs(style.metric)}>
            <span>2nd sales 24h (nb)</span>
            <strong>
              {token.marketStats?.secVolumeTz24 != null
                ? token.marketStats.secVolumeNb24
                : "/"}
            </strong>
          </article>
          <article className={cs(style.metric)}>
            <span>Items for sale</span>
            <strong>{token.marketStats?.listed || "0"}</strong>
          </article>
          <article className={cs(style.metric)}>
            <span>Lowest 2nd sale</span>
            <strong>
              {token.marketStats?.lowestSold != null ? (
                <DisplayTezos
                  mutez={token.marketStats.lowestSold}
                  formatBig={false}
                  maxDecimals={2}
                />
              ) : (
                "/"
              )}
            </strong>
          </article>
          <article className={cs(style.metric)}>
            <span>Highest 2nd sale</span>
            <strong>
              {token.marketStats?.highestSold != null ? (
                <DisplayTezos
                  mutez={token.marketStats.highestSold}
                  formatBig={false}
                  maxDecimals={2}
                />
              ) : (
                "/"
              )}
            </strong>
          </article>
          <article className={cs(style.metric)}>
            <span>Floor</span>
            <strong>
              {token.marketStats?.floor ? (
                <DisplayTezos mutez={token.marketStats.floor} />
              ) : (
                "/"
              )}
            </strong>
          </article>
          <article className={cs(style.metric)}>
            <span>Median</span>
            <strong>
              {token.marketStats?.median ? (
                <DisplayTezos mutez={token.marketStats.median} />
              ) : (
                "/"
              )}
            </strong>
          </article>
        </div>
      </section>

      <Spacing size="4x-large" sm="5x-large" />

      <TabsContainer
        className={style.tabs}
        tabDefinitions={tabs}
        tabsLayout="fixed-size"
        initialIdx={tabs.findIndex(({ name }) => name === tab)}
        onClickTab={(tabIndex) => {
          const { id } = router.query
          // push the new route to avoid query param conflicts
          router.push(
            `/marketplace/generative/${id}/${tabs[tabIndex].name}`,
            undefined,
            { shallow: true }
          )
        }}
      >
        {({ tabIndex }) => (
          <section className={cs(layout["padding-big"])}>
            <Spacing size="3x-large" sm="x-large" />
            {tabIndexes.listed === tabIndex ? (
              <ClientOnlyEmpty>
                <GenerativeListings token={token} />
              </ClientOnlyEmpty>
            ) : tabIndexes.tickets === tabIndex ? (
              <ClientOnlyEmpty>
                <GenerativeMintTickets
                  tokenId={token.id}
                  defaultTicketsLabel="For sale"
                  showCurrentUserTickets={false}
                  showGracePeriodTickets={false}
                />
              </ClientOnlyEmpty>
            ) : tabIndexes.offers === tabIndex ? (
              <ClientOnlyEmpty>
                <GenerativeOffers token={token} />
              </ClientOnlyEmpty>
            ) : tabIndexes.stats === tabIndex ? (
              <ClientOnlyEmpty>
                <GenerativeStatsMarketplace token={token} />
              </ClientOnlyEmpty>
            ) : (
              <ClientOnlyEmpty>
                <GenerativeActions
                  token={token}
                  filters={actionFilters}
                  className={cs(styleActivity.activity)}
                />
              </ClientOnlyEmpty>
            )}
          </section>
        )}
      </TabsContainer>

      {/* TODO: add some tabs for toggling between these 2 */}
      {/* TODO: add the available offers for the token */}
      {/* TODO: add the activity on the market for the collection */}

      <Spacing size="6x-large" sm="3x-large" />
      <Spacing size="6x-large" sm="none" />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let idStr = context.params?.id
  let token: GenerativeToken | null = null

  const tab = context.params?.tab?.[0] || "listed"
  const isExistingTab = marketplaceComponentsKeys.indexOf(tab) > -1
  if (!isExistingTab) {
    return {
      redirect: {
        destination: `/marketplace/generative/id/listed`,
        permanent: false,
      },
    }
  }

  if (idStr) {
    const id = parseInt(idStr as string)
    if (id === 0 || id) {
      const apolloClient = createApolloClient()
      const { data } = await apolloClient.query({
        query: Qu_genTokenMarketplace,
        fetchPolicy: "no-cache",
        variables: { id },
      })
      if (data) {
        token = data.generativeToken
      }
    }
  }

  return {
    props: {
      token: token,
      tab,
    },
    notFound: !token,
  }
}

export default GenerativeTokenMarketplace
