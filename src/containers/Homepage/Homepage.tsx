import React, { memo } from "react"
import { HomeHero } from "./HomeHero"
import { HomeMarketplace } from "./HomeMarketplace"
import { HomeGetStarted } from "./HomeGetStarted"
import { HomeExplore } from "./HomeExplore"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import style from "./Homepage.module.scss"
import { NFTArticle } from "../../types/entities/Article"
import { LiveMintingEvent } from "../../types/entities/LiveMinting"
import { HomeEvents } from "./HomeEvents"
import { HomeIncoming } from "./HomeIncoming"
import { HomeDocs } from "./HomeDocs"

interface HomepageProps {
  generativeTokens: GenerativeToken[]
  incomingTokens: GenerativeToken[]
  randomGenerativeToken: GenerativeToken | null
  articles: NFTArticle[]
  events: LiveMintingEvent[]
}

const _Homepage = ({
  generativeTokens,
  incomingTokens,
  randomGenerativeToken,
  articles,
  events,
}: HomepageProps) => {
  return (
    <div className={style.container}>
      <HomeHero randomGenerativeToken={randomGenerativeToken} />
      <HomeMarketplace />
      {events.length > 0 && <HomeEvents events={events} />}
      <HomeDocs articles={articles} />
      {incomingTokens.length > 0 && (
        <HomeIncoming generativeTokens={incomingTokens} />
      )}
      <HomeExplore generativeTokens={generativeTokens} />
      <HomeGetStarted />
    </div>
  )
}

export const Homepage = memo(_Homepage)
