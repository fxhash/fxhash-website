import { FunctionComponent } from "react"
import { CardLoading } from "./CardLoading"
import { LargeCardLoading } from "./LargeCardLoading"


export type TCardType = "regular" | "large"
const mapCardLoading: Record<TCardType, FunctionComponent> = {
  regular: CardLoading,
  large: LargeCardLoading,
}

interface Props {
  number?: number
  type?: TCardType,
}

/**
 * This component renders N cards loading into the DOM
 */
export function CardsLoading({
  number = 15,
  type = "regular",
}: Props) {
  const CardLoadingComp = mapCardLoading[type]

  return (
    <>
      {Array(number).fill(0).map((_, idx) => (
        <CardLoadingComp key={idx} />
      ))}
    </>
  )
}