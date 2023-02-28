import { sleep } from "./promises"

type StopConditionType = (tryIdx: number) => boolean

/**
 * Fetch with some retries
 * @param url the URL to fetch
 * @param maxRetries maximum number of retries before giving up, and throwing an error
 * @param delay time between each call (waits for the end of previous call)
 * @param stopCondition a function which will be called before each iteration, if it returns false, it stops
 * @returns
 */
export const fetchRetry = async (
  url: string,
  maxRetries: number = 5,
  delay: number = 200,
  shouldStop: StopConditionType = () => false,
  timeout: number | false = false
): Promise<Response> => {
  let error: any
  for (let i = 0; i < maxRetries; i++) {
    if (shouldStop(i)) break
    try {
      const controller = new AbortController()
      if (timeout !== false) {
        setTimeout(() => controller.abort(), timeout)
      }
      const data = await fetch(url, {
        signal: controller.signal,
      })
      if (data.status === 404) throw "404"
      return data
    } catch (err) {
      error = err
    }
    await sleep(delay)
  }
  throw error
}
