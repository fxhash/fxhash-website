import Link from "next/link"
import { Button } from "../Button"
import { useMemo } from "react"
import { GenerativeToken } from "types/entities/GenerativeToken"
import { getGenerativeTokenUrl } from "utils/generative-token"

interface ButtonExploreParamsProps {
  token: GenerativeToken
  exploreParamsQuery?: string | null
}

export const ButtonExploreParams = ({
  token,
  exploreParamsQuery,
}: ButtonExploreParamsProps) => {
  // some shortcuts to get access to useful variables derived from the token data
  const fullyMinted = token.balance === 0
  const exploreSet = token.metadata.settings?.exploration

  // settings activated based on fully minted state
  const activeSettings = fullyMinted
    ? exploreSet?.postMint
    : exploreSet?.preMint

  const paramsUrl = useMemo(() => {
    if (exploreParamsQuery)
      return `${getGenerativeTokenUrl(
        token
      )}/explore-params?${exploreParamsQuery}`
    return `${getGenerativeTokenUrl(token)}/explore-params`
  }, [token, exploreParamsQuery])

  return (
    <Link href={paramsUrl} passHref>
      <Button
        isLink
        type="button"
        size="small"
        color="transparent"
        iconComp={<i aria-hidden className="fa-sharp fa-regular fa-slider" />}
        iconSide="right"
      >
        params
      </Button>
    </Link>
  )
}
