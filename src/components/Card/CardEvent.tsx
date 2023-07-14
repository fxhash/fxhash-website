import React, { memo, useCallback, useMemo, useState } from "react"
import {
  EventAvailability,
  LiveMintingEventWithArtists,
} from "../../types/entities/LiveMinting"
import style from "./CardEvent.module.scss"
import Link from "next/link"
import { format } from "date-fns"
import { Spacing } from "../Layout/Spacing"
import { Countdown } from "../Utils/Countdown"
import { EntityBadge } from "../User/EntityBadge"
import { iconArtist } from "../Icons/custom"
import cs from "classnames"
import { downloadTextAsGeneratedFile } from "../../utils/files"
import { generateCalendarDataForEvent } from "../../utils/ical"

const availabilityLabels: Record<EventAvailability, string> = {
  ONLINE: "online",
  IRL: "IRL",
}
interface CardEventProps {
  event: LiveMintingEventWithArtists
}
const _CardEvent = ({ event }: CardEventProps) => {
  const {
    name,
    startsAt,
    endsAt,
    id,
    artists,
    imageUrl,
    location,
    availabilities,
  } = event
  const [now, setNow] = useState(new Date())
  const dateStartAt = useMemo(() => new Date(startsAt), [startsAt])
  const dateEndsAt = useMemo(() => new Date(endsAt), [endsAt])
  const eventTimeStatus = useMemo<"upcoming" | "ongoing" | "past">(() => {
    const isLive = now > dateStartAt
    if (!isLive) return "upcoming"
    const isPast = now > new Date(endsAt)
    if (isPast) return "past"
    return "ongoing"
  }, [dateStartAt, endsAt, now])
  const styleBackground = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.54), rgba(0, 0, 0, 0.54)), url(${imageUrl})`,
  }
  return (
    <Link href={`/events/${id}/onboarding`}>
      <a className={style.card}>
        <div className={style.cardHeader} style={styleBackground} />
        <div className={style.cardBody}>
          <h4 className={style.title}>{name}</h4>
          <div>
            <div className={style.date}>
              {format(dateStartAt, "do MMMM yyyy")}
              {eventTimeStatus === "upcoming" && (
                <> @ {format(dateStartAt, "Haaa")}</>
              )}
              {startsAt !== endsAt && eventTimeStatus !== "upcoming" && (
                <> — {format(dateEndsAt, "do MMM yyyy")}</>
              )}
            </div>
            <Spacing size="x-small" />
            <div className={style.location}>{location || "Online"}</div>
          </div>
        </div>
      </a>
    </Link>
  )
}

export const CardEvent = memo(_CardEvent)
