import style from "./onboarding.module.scss"
import layout from "styles/Layout.module.scss"
import cs from "classnames"
import { cloneDeep } from "@apollo/client/utilities"
import { GetServerSideProps, NextPage } from "next"
import { ArticleContent } from "../../../components/Article/ArticleContent"
import { Qu_eventDetails } from "../../../queries/events/events"
import { createEventsClient } from "../../../services/EventsClient"
import { mdToHtml } from "../../../services/Markdown"
import { LiveMintingEvent } from "../../../types/entities/LiveMinting"
import { Spacing } from "../../../components/Layout/Spacing"
import Head from "next/head"
import { Qu_genTokens } from "../../../queries/generative-token"
import { GenerativeToken } from "../../../types/entities/GenerativeToken"
import { createApolloClient } from "../../../services/ApolloClient"
import { CardsExplorer } from "../../../components/Exploration/CardsExplorer"
import { InfiniteScrollTrigger } from "../../../components/Utils/InfiniteScrollTrigger"
import { CardsContainer } from "../../../components/Card/CardsContainer"
import { GenerativeTokenCard } from "../../../components/Card/GenerativeTokenCard"
import { CardsLoading } from "../../../components/Card/CardsLoading"
import { useContext } from "react"
import { SettingsContext } from "../../../context/Theme"
import { ArticleEvent } from "components/Article/ArticleEvent"

type Props = {
  event: LiveMintingEvent
  tokens: GenerativeToken[]
}
const EventsOnboardingPage: NextPage<Props> = ({ event, tokens }) => {
  const settings = useContext(SettingsContext)

  return (
    <>
      <Head>
        <title>fxhash — {event.name} onboarding</title>
        <meta name="description" content={event.description} />
        <meta
          key="og:title"
          property="og:title"
          content={`fxhash — ${event.name} onboarding`}
        />
        <meta
          key="og:description"
          property="og:description"
          content={event.description}
        />
        <meta key="og:type" property="og:type" content="website" />
        <meta name="twitter:site" content="@fx_hash_" />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content={`fxhash — ${event.name} onboarding`}
        />
        <meta name="twitter:description" content={event.description} />
      </Head>

      <main className={cs(layout["padding-small"])}>
        <Spacing size="3x-large" />
        <ArticleEvent
          content={event.onboarding!.description}
          className={cs(style.body)}
        />
        {event.onboarding!.components.map((comp, idx) => (
          <ArticleEvent
            key={idx}
            content={comp.component.content}
            className={cs(style.body)}
          />
        ))}
        {tokens && (
          <>
            <Spacing size="3x-large" />
            <CardsExplorer>
              {({ refCardsContainer }) => (
                <CardsContainer
                  ref={refCardsContainer}
                  className={style.tokens}
                >
                  {tokens &&
                    tokens.length > 0 &&
                    tokens.map((token) => (
                      <GenerativeTokenCard
                        key={token.id}
                        token={token}
                        displayPrice={settings.displayPricesCard}
                        displayDetails={settings.displayInfosGenerativeCard}
                      />
                    ))}
                </CardsContainer>
              )}
            </CardsExplorer>
          </>
        )}
        <Spacing size="6x-large" />
        <Spacing size="6x-large" />
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!ctx.params || ctx.params.id == null) {
    return {
      notFound: true,
    }
  }

  const clientEvent = createEventsClient()
  const { data } = await clientEvent.query({
    query: Qu_eventDetails,
    variables: {
      where: {
        id: ctx.params.id,
      },
    },
  })

  if (!data || !data.event) {
    return {
      notFound: true,
    }
  }

  const client = createApolloClient()
  const { data: dataTokens } = await client.query<{
    generativeTokens: GenerativeToken[]
  }>({
    query: Qu_genTokens,
    variables: {
      take: 50,
      skip: 0,
      filters: {
        id_in: data.event.projectIds,
      },
    },
  })

  // process the markdown strings and replace strings from the object
  // clone deep so that we can mutate the object
  const event = cloneDeep(data.event)
  event.onboarding.description = await mdToHtml(event.onboarding.description)
  for (const component of event.onboarding.components) {
    component.component.content = await mdToHtml(component.component.content)
  }

  // quick trick to have video links as video tags
  // regex to find the video url in markdown

  event.onboarding.description = (
    event.onboarding.description as string
  ).replaceAll(/https:\/\/[^\s^\n]*\.mp4/g, (match) => {
    return `
      <video controls>
        <source src="${match}" type="video/mp4">
        Your browser does not support the video tag.
      </video>  
    `
  })

  return {
    props: {
      event: event,
      tokens: dataTokens?.generativeTokens || [],
    },
  }
}

export default EventsOnboardingPage
