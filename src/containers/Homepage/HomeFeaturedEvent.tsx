import { LiveMintingEvent } from "types/entities/LiveMinting"
import style from "./HomeFeaturedEvent.module.scss"
import cs from "classnames"
import Link from "next/link"

interface Props {
  event: LiveMintingEvent
}
export function HomeFeaturedEvent({ event }: Props) {
  console.log(event)
  return (
    <Link href={`/events/${event.id}/onboarding`}>
      <a className={cs(style.root)}>
        <img src={event.headerMedia!.url} alt={`${event.name} - banner`} />
      </a>
    </Link>
  )
}
