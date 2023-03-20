import React, { memo } from "react"
import { HomeHero } from "./HomeHero"
import { HomeMarketplace } from "./HomeMarketplace"
import { HomeGetStarted } from "./HomeGetStarted"
import { HomeExplore } from "./HomeExplore"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import style from "./Homepage.module.scss"
import { NFTArticle } from "../../types/entities/Article"

interface HomepageProps {
  generativeTokens: GenerativeToken[]
  randomGenerativeToken: GenerativeToken | null
  articles: NFTArticle[]
}

const _Homepage = ({
  generativeTokens,
  randomGenerativeToken,
  articles,
}: HomepageProps) => {
  return (
    <div className={style.container}>
      <HomeHero
        articles={articles}
        randomGenerativeToken={randomGenerativeToken}
      />
      <HomeMarketplace />
      <HomeExplore generativeTokens={generativeTokens} />
      <HomeGetStarted />
    </div>
  )
}

export const Homepage = memo(_Homepage)
