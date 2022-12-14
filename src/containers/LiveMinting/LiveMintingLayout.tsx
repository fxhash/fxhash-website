import { LayoutMinimalist } from "../../components/Layout/LayoutMinimalist"
import { TPageLayoutComponent } from "../../pages/_app"
import { LiveMintingRoot } from "./LiveMintingRoot"

export const LiveMintingLayout: TPageLayoutComponent = (page) => {
  return (
    <LayoutMinimalist>
      <LiveMintingRoot>
        {page}
      </LiveMintingRoot>
    </LayoutMinimalist>
  )
}