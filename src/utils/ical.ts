import { LiveMintingEventWithArtists } from "../types/entities/LiveMinting"
import type { EventAttributes } from "ics"
import { plural } from "./strings"

export const generateCalendarDataForEvent = (
  event: LiveMintingEventWithArtists
): EventAttributes => {
  const dateStart = new Date(event.startsAt)
  const dateEnd = new Date(event.endsAt)
  const opts: EventAttributes = {
    productId: "fxhash",
    start: [
      dateStart.getFullYear(),
      dateStart.getMonth(),
      dateStart.getDate(),
      dateStart.getHours(),
      dateStart.getMinutes(),
    ],
    end: [
      dateEnd.getFullYear(),
      dateEnd.getMonth(),
      dateEnd.getDate(),
      dateEnd.getHours(),
      dateEnd.getMinutes(),
    ],
    title: `${event.name} | fx(hash)`,
    location: event.location || "",
    status: "TENTATIVE",
    url: `${window.location.origin}/events/${event.id}/onboarding`,
    categories: ["Generative Art", "NFT"],
    alarms: [
      {
        action: "display",
        description: "Reminder",
        trigger: { hours: 1, minutes: 30, before: true },
      },
    ],
  }
  const descriptionLines = [event.description, ""]
  if (event.artists?.length > 0) {
    const allArtists = event.artists
      .map((artist) => artist.name || artist.id)
      .join(", ")
    descriptionLines.push(
      `Feat. artist${plural(event.artists.length)}: ${allArtists}.`
    )
  }
  opts.description = descriptionLines.join("\n")
  return opts
}
