import { addSeconds } from "date-fns"
import { utcToZonedTime } from "date-fns-tz"
import { Cycle, CyclesState } from "../types/Cycles"
import { Timezone } from "./timzones"

/**
 * Given a Date (with its timezone), and a cycle, outputs true if the cycle is opened
 * at the given date, and false otherwie
 */
export function isCycleOpenedAt(date: Date, cycle: Cycle, timezone?: Timezone): boolean {
  const reference = timezone ? utcToZonedTime(cycle.start, timezone.utc[0]) : cycle.start
  
  // get seconds between the 2 dates
  const diff = (date.getTime() - reference.getTime()) / 1000
  
  // modulo the cycle duration
  const cycleHours = diff % (cycle.opening + cycle.closing)
  
  // if cycleHours > 12, it means that the platform should be closed, otherwise opened
  return cycleHours < cycle.opening
}

/**
 * AND operation for each cycle against the given date, using the isCycleOpenedAt function
 */
export function areCyclesOpenedAt(date: Date, cycles: Cycle[], timezone?: Timezone): boolean {
  if (cycles.length === 0) return false
  let opened = true
  for (const cycle of cycles) {
    opened = opened && isCycleOpenedAt(date, cycle, timezone)
  }
  return opened
}

/**
 * Given a cycle, and a time (default = now), returns the Date of the closest
 * closing
 */
export function getCycleNextClosingTime(cycle: Cycle, time: Date = new Date()): Date {
  const duration = cycle.opening + cycle.closing
  const diff = (time.getTime()-cycle.start.getTime()) / 1000 | 0
  const rem = cycle.opening - diff % duration
  // if we are in an opening, then the next closing is during this cycle
  if (rem > 0) {
    return addSeconds(time, rem)
  }
  // otherwise the next closing is the one during the next cycle
  else {
    return addSeconds(time, rem + duration)
  }
}

/**
 * Given a cycle, and a time (default = now), returns the Date of the closest
 * opening
 */
export function getCycleNextOpeningTime(cycle: Cycle, time: Date = new Date()): Date {
  const duration = cycle.opening + cycle.closing
  const diff = (time.getTime()-cycle.start.getTime()) / 1000 | 0
  const mod = diff % duration
  return addSeconds(time, duration - mod)
}

/**
 * Given a list of cycles and a Date, outputs the state of the opening.
 * If the cycles are currently closed, outputs a false for the opening and
 * outputs the next opening time, otherwise outputs true and the next
 * closing time
 */
export function getCyclesState(cycles: Cycle[]): CyclesState {
  const now = new Date()

  // are the cycles current opened ?
  const opened = areCyclesOpenedAt(now, cycles)

  // the next closing time can be found by finding the nearest closing time
  // among any cycle
  // a list of the closing time for each cycle
  const closings = cycles.map(cycle => getCycleNextClosingTime(cycle, now))
  // get the smallest
  const nextClosing = closings.reduce((prev, curr) => curr < prev ? curr : prev, closings[0])


  // the next opening is not as easy, and maybe an analytical solution exists but
  // this is a brute force solution which also works
  // we need to find the next opening where ALL the cycles are enabled
  // for each cycle, loop through all their next openings and stop until one of the
  // next openings is opened for all the cycles
  // then the closest date is the closest opening where all the cycles are opened

  // record the closest openings where all the cycles are opened
  const closestOpenings: Date[] = []

  for (const cycle of cycles) {
    // get the closest next opening
    const closestCycleOpening = getCycleNextOpeningTime(cycle, now)
    const duration = cycle.closing + cycle.opening
    // only check within the next openings
    for (let i = 0; i < 30; i++) {
      const time = addSeconds(closestCycleOpening, i * duration)
      if (areCyclesOpenedAt(time, cycles)) {
        closestOpenings.push(time)
        break
      }
    }
  }

  // now the closest opening is the nearest
  const nextOpening = closestOpenings.reduce((prev, curr) => curr < prev ? curr : prev, closestOpenings[0])

  return {
    opened,
    nextClosing,
    nextOpening,
  }
}