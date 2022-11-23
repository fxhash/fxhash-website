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

type Props = {
  event: LiveMintingEvent
}
const EventsOnboardingPage: NextPage<Props> = ({ event }) => {
  return (
    <>
      <Head>
        <title>fxhash — {event.name} onboarding</title>
        <meta name="description" content={event.description} />
      </Head>

      <main className={cs(layout["padding-small"])}>
        <Spacing size="3x-large" />
        <ArticleContent
          content={event.onboarding!.description}
          className={cs(style.body)}
        />
        {event.onboarding!.components.map((comp, idx) => (
          <ArticleContent
            key={idx}
            content={comp.component.content}
            className={cs(style.body)}
          />
        ))}
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

  const client = createEventsClient()
  const { data } = await client.query({
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

  // process the markdown strings and replace strings from the object
  // clone deep so that we can mutate the object
  const event = cloneDeep(data.event)
  event.onboarding.description = await mdToHtml(event.onboarding.description)
  for (const component of event.onboarding.components) {
    component.component.content = await mdToHtml(component.component.content)
  }

  return {
    props: {
      event: event,
    },
  }
}

export default EventsOnboardingPage
