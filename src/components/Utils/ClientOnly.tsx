import { PropsWithChildren, useEffect, useState } from "react"
import { useIsMounted, useIsMountedState } from "../../utils/hookts"

export default function ClientOnly({ children, ...delegated }: PropsWithChildren<{}>) {
  const isMounted = useIsMountedState()

  if (!isMounted) {
    return null
  }

  return <div {...delegated}>{children}</div>
}

export function ClientOnlyEmpty({ children }: PropsWithChildren<{}>) {
  return <ClientOnly>{children}</ClientOnly>
}
