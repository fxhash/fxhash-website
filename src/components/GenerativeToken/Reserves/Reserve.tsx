import style from "./Reserve.module.scss"
import cs from "classnames"
import { IReserve } from "../../../types/entities/Reserve"
import { FunctionComponent } from "react"
import { mapReserveDefinition } from "../../../utils/generative-token"
import { ConnectedList } from "../../Layout/ConnectedList"

// the type of a render reserve component
export interface IRenderReserveProps {
  reserve: IReserve
}
export type TRenderReserveComponent = FunctionComponent<IRenderReserveProps>

interface Props {
  reserve: IReserve
}
export function Reserve({ reserve }: Props) {
  // get the definition of the reserve
  const definition = mapReserveDefinition[reserve.method]

  return (
    <div className={cs(style.root)}>
      <strong>
        {definition.label} ({reserve.amount})
      </strong>
      <definition.renderComponent reserve={reserve} />
    </div>
  )
}
