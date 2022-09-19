import { FunctionComponent } from "react"
import { TColor } from "../../../types/Colors"
import { Action } from "../../../types/entities/Action"

interface Props {
  action: Action
  verbose: boolean
}

export type TActionComp = FunctionComponent<Props>

export type TActionLinkFn = (action: Action) => string | null

export interface ActionDefinition {
  icon: string
  iconColor: TColor
  render: TActionComp
  predecescence: number
  link: TActionLinkFn | null
}
