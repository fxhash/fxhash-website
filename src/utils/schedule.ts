import { addSeconds, isBefore } from "date-fns"
import { utcToZonedTime } from "date-fns-tz"
import { Cycle, CyclesState } from "../types/Cycles"
import { TimeZone } from "@vvo/tzdb";

/**
 * Given a Date (with its timezone), and a cycle, outputs true if the cycle is opened
 * at the given date, and false otherwie
 */
export function isCycleOpenedAt(date: Date, cycle: Cycle, timezone?: TimeZone): boolean {
  const reference = timezone ? utcToZonedTime(cycle.start, timezone.name) : cycle.start

  // get seconds between the 2 dates
  const diff = (date.getTime() - reference.getTime()) / 1000

  // if the diff is negative, it's de facto disabled
  if (diff < 0) {
    return false
  }

  // modulo the cycle duration
  const cycleHours = diff % (cycle.opening + cycle.closing)

  // if cycleHours > 12, it means that the platform should be closed, otherwise opened
  return cycleHours < cycle.opening
}

/**
 * Performs a OR operation between the different array of cycles, and for each
 * array performs a AND operations for the cycles within
 * [[a,b], [c]] => ((a AND b) OR (c))
 */
export function areCyclesOpenedAt(
  date: Date,
  cycles: Cycle[][],
  timezone?: TimeZone,
): boolean {
  if (cycles.length === 0) return false
  let opened = false
  for (const cycleGroup of cycles) {
    let groupOpened = true
    for (const cycle of cycleGroup) {
      groupOpened = groupOpened && isCycleOpenedAt(date, cycle, timezone)
    }
    opened = opened || groupOpened
  }
  return opened
}

export function getCycleIdAt(date: Date, cycle: Cycle): number {
  return (date.getTime() - cycle.start.getTime()) / 1000 / (cycle.closing+cycle.opening) | 0
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
export function getCyclesState(cycles: Cycle[][]): CyclesState {
  const now = new Date()

  // are the cycles current opened ?
  const opened = areCyclesOpenedAt(now, cycles)

  // PROBLEM: find the closest opening & closing for any given set of cycles
  // with OR and AND operations
  // this is a brute force solution:
  // - loop through all the cycles
  // - find the next opening/closing of the cycle
  // - for the opening:
  //    - if all cycles are opened at the time of opening: add to list
  // - for closing:
  //    - if all cycles are closed at the time, add to list
  // find the min of each list

  // record the closest opening/closing where all the cycles are opened/closed
  let closestOpening: Date|null = null
  let closestClosing: Date|null = null

  // a list of cycles: [[]] => []
  const cyclesList = cycles.reduce((prev, curr) => prev.concat(curr), [])

  let duration,
      time,
      closestCycleOpening,
      closestCycleClosing

  for (const cycle of cyclesList) {
    // get the closest next opening & closing
    closestCycleOpening = getCycleNextOpeningTime(cycle, now)
    closestCycleClosing = getCycleNextClosingTime(cycle, now)
    duration = cycle.closing + cycle.opening

    // only check within the next 20 openings
    for (let i = 0; i < 20; i++) {
      time = addSeconds(closestCycleOpening, i * duration)
      // if opened at T and T is new min, set
      if (areCyclesOpenedAt(time, cycles)) {
        if (!closestOpening || isBefore(time, closestOpening)) {
          closestOpening = time
          // we can move to next cycle
          break
        }
      }
    }

    // same for closing
    for (let i = 0; i < 20; i++) {
      time = addSeconds(closestCycleClosing, i * duration)
      // if closed at T and T is new min, set
      if (!areCyclesOpenedAt(time, cycles)) {
        if (!closestClosing || isBefore(time, closestClosing)) {
          closestClosing = time
          // we can move to next cycle
          break
        }
      }
    }
  }

  return {
    opened,
    nextClosing: closestClosing!,
    nextOpening: closestOpening!,
  }
}

export interface ICycleTimeState {
  opened: boolean
  id: number
}

/**
 * Outputs the cycles state at a given point in time
 * (defined as a tuple (Date, Timezone))
 */
export function getCycleTimeState(
  date: Date,
  cycles: Cycle[][],
  timezone: TimeZone
): ICycleTimeState {
  return {
    opened: areCyclesOpenedAt(date, cycles, timezone),
    id: 0,
  }
}


/**
 * Returns a number which is how many parts an hour must be sliced to be displayed correctly
 */
export function getHourDividerFromTimezoneOffset(offsetInMinutes: number): number {
  if (offsetInMinutes % 60 === 0) return 1;
  if (offsetInMinutes % 30 === 0) return 2;
  return 4;
}
