export interface Cycle {
  // the reference point in time for the beginning of the cycle
  start: Date
  // how long (seconds) does the cycle stays open ?
  opening: number
  // how long (seconds) does the cycle stays closed ?
  closing: number
}

// the state of a cycle at a given point in time
export interface CyclesState {
  // are the cycles opened
  opened: boolean
  // the datetime of the next opening
  nextOpening: Date
  // the datetime of the next closing
  nextClosing: Date
}
