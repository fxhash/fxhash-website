import style from "./ContractsOpened.module.scss"
import cs from "classnames"
import { getCyclesState } from "../../utils/schedule"
import { useContext, useEffect, useMemo, useState } from "react"
import { Countdown } from "./Countdown"
import { addHours } from "date-fns"
import { CyclesContext } from "../../context/Cycles"
import { Loader } from "./Loader"

export function ContractsOpened() {
  // get cycles from context (directly from contracts)
  const { cycles } = useContext(CyclesContext)

  const [counter, setCounter] = useState<number>(0)
  const [cyclesState, setCyclesState] = useState(getCyclesState(cycles))

  useEffect(() => {
    setCyclesState(getCyclesState(cycles))
  }, [cycles, counter])

  const onEnd = () => {
    setCounter(counter + 1)
    setTimeout(() => {
      setCounter(counter + 2)
    }, 2000)
  }

  return (
    <>
      {cycles.length === 0 ? (
        <Loader size="small" />
      ) : !cyclesState.opened ? (
        <div className={cs(style.state, style.state_closed)}>
          <div className={style.text}>
            <span>Publishing new projects closed for </span>
            <span>
              <Countdown until={cyclesState.nextOpening} onEnd={onEnd} />
            </span>
          </div>
          <div className={style.circle} />
        </div>
      ) : (
        <div className={cs(style.state)}>
          <div className={style.text}>
            <span>Publishing new projects opened for </span>
            <span>
              <Countdown until={cyclesState.nextClosing} onEnd={onEnd} />
            </span>
          </div>
          <div className={style.circle} />
        </div>
      )}
    </>
  )
}
