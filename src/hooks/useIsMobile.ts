import { useMemo } from "react"
import useWindowSize, { breakpoints } from "./useWindowsSize"

export default function useIsMobile(breakpoint: number = breakpoints.md) {
  const { width } = useWindowSize()

  return useMemo(() => width !== undefined && width <= breakpoint, [width, breakpoint])
}
