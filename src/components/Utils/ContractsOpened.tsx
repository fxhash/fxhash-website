import style from "./ContractsOpened.module.scss"
import cs from "classnames"
import { useContractStorage } from "../../utils/hookts"
import { getMsUntilClose, getNextCycleStartTime } from "../../utils/schedule"
import { useEffect, useState } from "react"
import { getLocalTimezone } from "../../utils/timzones"

export function ContractsOpened() {
  const { data: issuerStorage } = useContractStorage(process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_ISSUER!)
  const [timeUntilClose, setTimeUntilClose] = useState<number>(0)
  const [nextCycleStart, setNextCycleStart] = useState<number>(0)
  const [cyclePaused, setCyclePaused] = useState<Boolean>(false);
  const [mintTimeStatus, setMintTimeStatus] = useState<string>()

  useEffect(() => {
    setTimeUntilClose(getMsUntilClose())
    setNextCycleStart(getNextCycleStartTime())
    if (timeUntilClose < 0) {
      // we are closed
      setCyclePaused(true);
      const nextOpen = new Date(nextCycleStart)
      const nextOpenString = nextOpen.toLocaleTimeString("en-US", { hour: 'numeric' })
      setMintTimeStatus(`(opens at ${nextOpenString})`)
    }
    else {
      // we are open
      setCyclePaused(false);
      const nextClose = new Date(Date.now() + timeUntilClose)
      const nextCloseString = nextClose.toLocaleTimeString("en-US", { hour: 'numeric' })
      setMintTimeStatus(`(closes at ${nextCloseString})`)
    }
  })

  return issuerStorage ? (
    <div className={cs(style.state, { [style.state_closed]: issuerStorage.paused })}>
      <span>
        {/* occasionally we override the open/close schedule, so only show
        the estimated opening time if the cycle's pause matches the contract's */}
        MINT {issuerStorage.paused ? "CLOSED" : "OPENED"} {(issuerStorage.paused === cyclePaused) && mintTimeStatus}
      </span>
      <div />
    </div>
  ) : null
}
