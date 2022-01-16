export interface Cycle {
  // the reference point in time for the beginning of the cycle
  start: Date
  // how long (seconds) does the cycle stays open ?
  opening: number
  // how long (seconds) does the cycle stays closed ?
  closing: number
}