import { PropsWithChildren, useEffect, useState } from "react"
import { useIsMounted } from "../../utils/hookts"

export default function ClientOnly({ children, ...delegated }: PropsWithChildren<{}>) {
  const isMounted = useIsMounted();

  if (!isMounted()) {
    return null
  }

  return <div {...delegated}>{children}</div>
}

export function ClientOnlyEmpty({ children }: PropsWithChildren<{}>) {
  return <ClientOnly>{children}</ClientOnly>
}
