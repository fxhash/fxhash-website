import Link from "next/link"
import { Button } from "../Button"
import { useMemo } from "react"
import { GenerativeToken } from "types/entities/GenerativeToken"
import {
  getGenerativeTokenUrl,
  isExplorationDisabled,
} from "utils/generative-token"
import { HoverTitle } from "components/Utils/HoverTitle"

interface ButtonExploreParamsProps {
  token: GenerativeToken
  exploreParamsQuery?: string | null
}

export const ButtonExploreParams = ({
  token,
  exploreParamsQuery,
}: ButtonExploreParamsProps) => {
  const disabled = isExplorationDisabled(token)

  const paramsUrl = useMemo(() => {
    if (exploreParamsQuery)
      return `${getGenerativeTokenUrl(
        token
      )}/explore-params?${exploreParamsQuery}`
    return `${getGenerativeTokenUrl(token)}/explore-params`
  }, [token, exploreParamsQuery])

  // the hover message is only here if disabled, and depends some conditions
  const hoverMessage = useMemo<string | null>(
    () =>
      disabled
        ? "Artist disabled the exploration of params after minting phase"
        : null,
    []
  )

  return (
    <HoverTitle message={hoverMessage}>
      <Link href={paramsUrl} passHref>
        <Button
          disabled={disabled}
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
    </HoverTitle>
  )
}
