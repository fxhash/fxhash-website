import { CardLoading } from "./CardLoading"

interface Props {
  number?: number
}

/**
 * This component renders N cards loading into the DOM
 */
export function CardsLoading({
  number = 15
}: Props) {
  return (
    <>
      {Array(number).fill(0).map((_, idx) => (
        <CardLoading key={idx} />
      ))}
    </>
  )
}