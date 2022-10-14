import { HTMLAttributes, PropsWithChildren } from "react"

export type CARDSIZE_SMALL = 200
export type CARDSIZE_MEDIUM = 270
export type CARDSIZE_LARGE = 400

export interface ICardContainerProps
  extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  cardSize?: CARDSIZE_SMALL | CARDSIZE_MEDIUM | CARDSIZE_LARGE
  addDivs?: boolean
}

