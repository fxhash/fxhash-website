import cs from "classnames"
import layout from "../styles/Layout.module.scss"
import { NextPage } from "next"
import colors from "../styles/Colors.module.css"

const MaintenancePage: NextPage = () => {
  return (
    <main className={cs(layout.y_centered, layout.full_body_height)}>
      <h2 className={cs(colors.primary)}>
        🚧 fxhash is temporarily in maintenance mode 🚧
      </h2>
      <p>{process.env.NEXT_PUBLIC_MAINTENANCE_MESSAGE}</p>
    </main>
  )
}

export default MaintenancePage
