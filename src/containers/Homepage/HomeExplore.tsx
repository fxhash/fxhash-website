import React, { memo, useContext } from "react"
import { TitleHyphen } from "../../components/Layout/TitleHyphen"
import { CardsContainer } from "../../components/Card/CardsContainer"
import cs from "classnames"
import style from "./HomeExplore.module.scss"
import layout from "../../styles/Layout.module.scss"
import { GenerativeTokenCard } from "../../components/Card/GenerativeTokenCard"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { SettingsContext } from "../../context/Theme"
import Link from "next/link"

interface HomeExploreProps {
  generativeTokens: GenerativeToken[]
}

const _HomeExplore = ({ generativeTokens }: HomeExploreProps) => {
  const settings = useContext(SettingsContext)
  return (
    <div className={cs(layout["padding-big"], style.container)}>
      <TitleHyphen>recent projects</TitleHyphen>
      <CardsContainer
        className={cs(style["row-responsive-limiter"], style.projects)}
      >
        {generativeTokens.map((token) => (
          <GenerativeTokenCard
            key={token.id}
            token={token}
            displayPrice={settings.displayPricesCard}
            displayDetails={settings.displayInfosGenerativeCard}
          />
        ))}
      </CardsContainer>
      <div className={style.cta}>
        <Link href={"/explore"}>
          <a className={style.explore_more}>
            explore more <i aria-hidden="true" className="fas fa-arrow-right" />
          </a>
        </Link>
      </div>
    </div>
  )
}

export const HomeExplore = memo(_HomeExplore)
