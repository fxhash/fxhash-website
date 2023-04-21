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
  const handleEndTimer = useCallback(() => setNow(new Date()), [])
  const handleClickCalendar = useCallback(async () => {
    const icsCreateEvent = (await import("ics")).createEvent
    icsCreateEvent(generateCalendarDataForEvent(event), (error, value) => {
      if (error) {
        console.error(error)
        return
      }
      downloadTextAsGeneratedFile(
        `${format(dateStartAt, "yyyy-M-d")}-${id}.ics`,
        value
      )
    })
  }, [dateStartAt, event, id])
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
  const availabilitiesStr = useMemo(() => {
    return availabilities
      .map((availability) => availabilityLabels[availability])
      .join(" and ")
  }, [availabilities])
  return (
    <div className={style.card} style={styleBackground}>
      <div>
        <h4 className={style.card_title}>{name}</h4>
        <Spacing size="2x-small" />
        <div className={style.card_text}>{location}</div>
      </div>
      <div className={style.card_body}>
        <div>
          <div className={style.card_text}>Scheduled</div>
          <Spacing size="2x-small" />
          <div className={style.card_date}>
            {format(dateStartAt, "do MMMM yyyy")} at&nbsp;
            {format(dateStartAt, "H:mm")}
          </div>
          <Spacing size="x-small" />
          <div className={style.timer}>
            <span
              className={cs(style.dot, {
                [style.dot_active]: eventTimeStatus === "ongoing",
              })}
            />
            {eventTimeStatus === "upcoming" && (
              <span className={style.label}>
                <span>Starts in </span>
                <Countdown until={dateStartAt} onEnd={handleEndTimer} />
              </span>
            )}
            {eventTimeStatus === "ongoing" && (
              <span className={style.label}>Ongoing</span>
            )}
            {eventTimeStatus === "past" && (
              <span className={style.label}>Finished</span>
            )}
          </div>
        </div>
        {artists.length > 0 && (
          <div className={style.artists}>
            <span>{artists.length}</span>
            <i aria-hidden="true" aria-label="artists">
              {iconArtist}
            </i>
          </div>
        )}
      </div>
      <div className={style.card_verso}>
        <div className={style.card_header}>
          <div className={style.card_infos}>
            <div className={style.card_title}>Exhibiting</div>
            {availabilities.length > 0 && (
              <>
                <Spacing size="2x-small" />
                <div className={style.card_text}>
                  Available {availabilitiesStr}
                </div>
              </>
            )}
          </div>
          <button
            className={style.cta_calendar}
            onClick={handleClickCalendar}
            title="Save to your calendar"
          >
            <i className="fa-regular fa-calendar-circle-plus" />
          </button>
        </div>
        <div className={style.card_artists}>
          {artists.map((artist) => (
            <div key={artist.id}>
              <EntityBadge user={artist} size="small" hasLink />
            </div>
          ))}
        </div>
        <Link href={`/events/${id}/onboarding`}>
          <a className={style.cta_view_event}>View event</a>
        </Link>
      </div>
    </div>
  )
}

export const CardEvent = memo(_CardEvent)
