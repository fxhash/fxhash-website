import React, { memo, useContext } from "react"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import cs from "classnames"
import layout from "../../styles/Layout.module.scss"
import style from "./HomeIncoming.module.scss"
import { TitleHyphen } from "../../components/Layout/TitleHyphen"
import { CardsContainer } from "../../components/Card/CardsContainer"
import { GenerativeTokenCard } from "../../components/Card/GenerativeTokenCard"
import Link from "next/link"
import { SettingsContext } from "../../context/Theme"

interface HomeIncomingProps {
  generativeTokens: GenerativeToken[]
}

const _HomeIncoming = ({ generativeTokens }: HomeIncomingProps) => {
  const settings = useContext(SettingsContext)
  return (
    <div className={cs(layout["padding-big"], style.container)}>
      <div className={style.container_title}>
        <TitleHyphen>incoming projects</TitleHyphen>
        <Link href={"/explore/incoming"}>
          <a className={style.explore_more}>
            see all <i aria-hidden="true" className="fas fa-arrow-right" />
          </a>
        </Link>
      </div>
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
    </div>
  )
}

export const HomeIncoming = memo(_HomeIncoming)
