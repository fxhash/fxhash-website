import React, { memo, useMemo } from "react"
import { LiveMintingEvent } from "../../types/entities/LiveMinting"
import { CardEvent } from "../../components/Card/CardEvent"
import style from "./HomeEvents.module.scss"
import { TitleHyphen } from "../../components/Layout/TitleHyphen"
import cs from "classnames"
import layout from "../../styles/Layout.module.scss"
import { Spacing } from "../../components/Layout/Spacing"
import { useQuery } from "@apollo/client"
import { Qu_genTokensAuthors } from "../../queries/generative-token"
import { User } from "../../types/entities/User"
import { GenerativeToken } from "../../types/entities/GenerativeToken"

type EventByProjectIds = {
  projectIdsEvent: Record<number, string>
  projectIds: number[]
}
interface HomeEventsProps {
  events: LiveMintingEvent[]
}

const _HomeEvents = ({ events }: HomeEventsProps) => {
  const mapEventsToProjectId = useMemo(
    () =>
      events.reduce(
        (acc, ev) => {
          ev.projectIds.forEach((projectId) => {
            acc.projectIdsEvent[projectId] = ev.id
            acc.projectIds.push(projectId)
          })
          return acc
        },
        {
          projectIdsEvent: {},
          projectIds: [],
        } as EventByProjectIds
      ),
    [events]
  )
  const { data } = useQuery<{ generativeTokens: GenerativeToken[] }>(
    Qu_genTokensAuthors,
    {
      fetchPolicy: "cache-and-network",
      variables: {
        take: 50,
        skip: 0,
        projectIds: mapEventsToProjectId.projectIds,
      },
    }
  )

  const authorByProject = useMemo(() => {
    if (!data?.generativeTokens.length) return {}
    return data.generativeTokens.reduce((acc, token) => {
      acc[token.id] = token.author
      return acc
    }, {} as Record<number, User>)
  }, [data])

  const eventsWithArtist = useMemo(() => {
    return events.map((event) => {
      const distinctArtistsIds = [] as string[]
      const artists = event.projectIds.reduce((acc, projectId) => {
        const artist = authorByProject[projectId]
        if (artist && distinctArtistsIds.indexOf(artist.id) === -1) {
          acc.push(artist)
          distinctArtistsIds.push(artist.id)
        }
        return acc
      }, [] as User[])
      return {
        ...event,
        artists,
      }
    })
  }, [authorByProject, events])
  return (
    <div className={cs(layout["padding-big"], style.container)}>
      <TitleHyphen>upcoming events</TitleHyphen>
      <Spacing size="2x-large" />
      <div className={style.container_events}>
        {eventsWithArtist.map((event) => (
          <CardEvent key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}

export const HomeEvents = memo(_HomeEvents)
