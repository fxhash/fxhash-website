import { HTMLAttributes, PropsWithChildren } from "react"

export interface ICardContainerProps extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  cardSize?: number
  emptyDivs?: number
}