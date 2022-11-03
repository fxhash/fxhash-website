import style from "./LiveMintingWait.module.scss"
import cs from "classnames"
import { LiveMintingEvent } from "../../types/entities/LiveMinting"
import { DateFormatted } from "../../components/Utils/Date/DateFormat"
import Link from "next/link"
import { Button } from "../../components/Button"

interface Props {
  event: LiveMintingEvent
}
export function LiveMintingWait({
  event,
}: Props) {
  return (
    <div className={cs(style.root)}>
      <div>Please come back on this page on the</div>
      <strong>
        <DateFormatted
          date={event.startsAt}
        />
      </strong>
      <p>In the meantime, you can explore fxhash</p>
      <br/>
      <Link href="/explore" passHref>
        <Button
          isLink
          size="regular"
          color="secondary"
        >
          explore fxhash
        </Button>
      </Link>
    </div>
  )
}