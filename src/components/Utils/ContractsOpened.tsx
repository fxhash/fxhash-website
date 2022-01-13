import style from "./ContractsOpened.module.scss"
import cs from "classnames"
import { getMsUntilClose, getNextCycleStartTime } from "../../utils/schedule"
import { useMemo, useState } from "react"
import { Countdown } from "./Countdown"
import { addHours } from "date-fns"

export function ContractsOpened() {
  /**
   * This whole thing needs to be rewritten properly with actual cycles, using tzkt
   * to get list of cycles in the allower and the cycles that matches in the bigmap
   * of the cycles contract (2 queries, only once on the client, in context) 
   */
  const [nextCycleStart, setNextCycleStart] = useState(getNextCycleStartTime())
  const [timeToClose, setTimeToClose] = useState(getMsUntilClose())
  const nextCycleDate = useMemo(() => new Date(nextCycleStart), [nextCycleStart])
  const nextCycleEnd = useMemo(() => addHours(new Date(nextCycleStart), -14), [nextCycleStart])
  const isOpened = timeToClose >= 0

  const onEnd = () => {
    setNextCycleStart(getNextCycleStartTime())
    setTimeToClose(getMsUntilClose())
    setTimeout(() => {
      setNextCycleStart(getNextCycleStartTime())
      setTimeToClose(getMsUntilClose())
    }, 2000)
  }
  
  return (
    <>
      {!isOpened ? (
        <div className={cs(style.state, style.state_closed)}>
          <span>OPEN IN</span>
          <span>
            <Countdown
              until={nextCycleDate}
              onEnd={onEnd}
            />
          </span>
          <div/>
        </div>
      ):(
        <div className={cs(style.state)}>
          <span>OPENED FOR </span>
          <span>
            <Countdown
              until={nextCycleEnd}
              onEnd={onEnd}
            />
          </span>
          <div/>
        </div>
      )}
    </>
  )
}
