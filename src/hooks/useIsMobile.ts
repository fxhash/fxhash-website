import { useMemo } from "react"
import useWindowSize, { breakpoints } from "./useWindowsSize"

export default function useIsMobile(breakpoint: number = breakpoints.sm) {
  const { width } = useWindowSize()

  return useMemo(() => width !== undefined && width <= breakpoint, [width])
}
