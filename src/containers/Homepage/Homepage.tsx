import React, { memo } from "react"
import { HomeHero } from "./HomeHero"
import { HomeMarketplace } from "./HomeMarketplace"
import { HomeGetStarted } from "./HomeGetStarted"
import { HomeExplore } from "./HomeExplore"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import style from "./Homepage.module.scss"

interface HomepageProps {
  generativeTokens: GenerativeToken[]
  randomGenerativeToken: GenerativeToken | null
}

const _Homepage = ({
  generativeTokens,
  randomGenerativeToken,
}: HomepageProps) => {
  return (
    <div className={style.container}>
      <HomeHero randomGenerativeToken={randomGenerativeToken} />
      <HomeMarketplace />
      <HomeExplore generativeTokens={generativeTokens} />
      <HomeGetStarted />
    </div>
  )
}

export const Homepage = memo(_Homepage)
