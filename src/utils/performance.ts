import { performance } from "perf_hooks"

interface PerformanceTiming {
  started: number
  name: string
}

class PerformanceTimingsClass {
  timings: Record<string, PerformanceTiming> = {}

  start(name: string, id?: string): string {
    if (!id) {
      id = "" + Math.random()
    }
    this.timings[id] = {
      started: performance.now(),
      name
    }
    return id
  }

  end(id: string) {
    const T = this.timings[id]
    if (T) {
      console.log(`measure [${T.name}]: ${performance.now() - T.started}ms`)
      delete this.timings[id]
    }
  }
}

export const PerformanceTimings = new PerformanceTimingsClass()