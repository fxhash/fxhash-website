import { LayoutMinimalist } from "../../components/Layout/LayoutMinimalist"
import { TPageLayoutComponent } from "../../containers/App"
import { LiveMintingRoot } from "./LiveMintingRoot"

export const LiveMintingLayout: TPageLayoutComponent = (page) => {
  return (
    <LayoutMinimalist>
      <LiveMintingRoot>{page}</LiveMintingRoot>
    </LayoutMinimalist>
  )
}

