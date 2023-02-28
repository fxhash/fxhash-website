import { sub } from "date-fns"

export function isLaunchCountdown(): boolean {
  return (
    process.env.NEXT_PUBLIC_LAUNCH_TIME !== undefined &&
    new Date().getTime() -
      new Date(process.env.NEXT_PUBLIC_LAUNCH_TIME).getTime() <
      0
  )
}
