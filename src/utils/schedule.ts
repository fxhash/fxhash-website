import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz"
import { Cycle } from "../types/Cycles"
import { Timezone } from "./timzones"

const OPENING_HOURS = 8
const CLOSING_HOURS = 14
const MS_PER_CYCLE = 1000*3600*(OPENING_HOURS+CLOSING_HOURS) // (1000ms * 60s * 60m * 23h)
const MS_PER_OPEN = 1000*3600*OPENING_HOURS // (1000ms * 60s * 60m * 12h)

export function isPlatformOpenedAt(date: Date, timezone: Timezone): boolean {
  const reference = utcToZonedTime(new Date(process.env.NEXT_PUBLIC_REFERENCE_OPENING!), timezone.utc[0])

  // get seconds between the 2 dates
  const diff = (date.getTime() - reference.getTime()) / 1000
  const hours = diff / 3600

  // modulo the cycle duration
  const cycleHours = hours % (OPENING_HOURS + CLOSING_HOURS)

  // if cycleHours > 12, it means that the platform should be closed, otherwise opened
  return cycleHours < OPENING_HOURS
}

/**
 * Given a Date (with its timezone), and a cycle, outputs true if the cycle is opened
 * at the given date, and false otherwie
 */
export function isCycleOpenedAt(date: Date, cycle: Cycle, timezone: Timezone): boolean {
  const reference = utcToZonedTime(cycle.start, timezone.utc[0])
  
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
export function areCyclesOpenedAt(date: Date, cycles: Cycle[], timezone: Timezone): boolean {
  if (cycles.length === 0) return false
  let opened = true
  for (const cycle of cycles) {
    opened = opened && isCycleOpenedAt(date, cycle, timezone)
  }
  return opened
}

/**
 * Calculate milliseconds until closure.
 * 
 * The returned value is negative if the system is in a closed state, 
 * which conveniently can be added to the next opening event to find 
 * how much closing time remains.
 * @returns number of ms until the next open/close event. Value is calculated as `(milliseconds of open) - (milliseconds into the current cycle)`
 */
export function getMsUntilClose(): number {
  const reference = new Date(process.env.NEXT_PUBLIC_REFERENCE_OPENING!)
  const diff = Date.now() - reference.getTime()
  const cycleTime = diff % MS_PER_CYCLE
  return MS_PER_OPEN - cycleTime
}

/**
 * Calculate start time of the next cycle, based on the current time.
 * 
 * @returns The start time of the next cycle (in Unix time)
 */
export function getNextCycleStartTime(): number {
  const reference = new Date(process.env.NEXT_PUBLIC_REFERENCE_OPENING!)
  const currentTime = Date.now()
  const diff = currentTime - reference.getTime()
  const cycleTime = diff % MS_PER_CYCLE
  const startCurrentCycle = currentTime - cycleTime
  return startCurrentCycle + MS_PER_CYCLE
}
