import React, { memo } from "react"
import { HomeHero } from "./HomeHero"
import { HomeMarketplace } from "./HomeMarketplace"
import { HomeGetStarted } from "./HomeGetStarted"
import { HomeExplore } from "./HomeExplore"
import { GenerativeToken } from "../../types/entities/GenerativeToken";

interface HomepageProps {
  generativeTokens: GenerativeToken[]
}

const _Homepage = ({ generativeTokens }: HomepageProps) => {
  return (
    <>
      <HomeHero />
      <HomeMarketplace />
      <HomeExplore generativeTokens={generativeTokens} />
      <HomeGetStarted />
    </>
  )
}

export const Homepage = memo(_Homepage)
