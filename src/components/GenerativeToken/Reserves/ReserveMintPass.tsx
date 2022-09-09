import cs from "classnames"
import style from "./ReserveMintPass.module.scss"
import { TRenderReserveComponent } from "./Reserve"


export const ReserveMintPass: TRenderReserveComponent = ({
  reserve,
}) => {
  // todo: query the backend to get event details from mint pass address

  return (
    <div>
      {reserve.data}
    </div>
  )
}