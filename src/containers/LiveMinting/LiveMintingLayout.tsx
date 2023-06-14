import { useRouter } from "next/router"
import { LayoutMinimalist } from "../../components/Layout/LayoutMinimalist"
import { TPageLayoutComponent } from "../../containers/App"
import { LiveMintingRoot } from "./LiveMintingRoot"

export const LIVE_MINTING_FULLSCREEN_ROUTES = [
  "/live-minting/[id]/generative/[tokenId]/explore-params",
]

export const LiveMintingLayout: TPageLayoutComponent = (page) => {
  const router = useRouter()

  return LIVE_MINTING_FULLSCREEN_ROUTES.includes(router.pathname) ? (
    <LiveMintingRoot>{page}</LiveMintingRoot>
  ) : (
    <LayoutMinimalist>
      <LiveMintingRoot>{page}</LiveMintingRoot>
    </LayoutMinimalist>
  )
}
