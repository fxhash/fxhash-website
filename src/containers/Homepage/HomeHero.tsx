import React, { memo } from "react"
import style from "./HomeHero.module.scss"

const _HomeHero = () => {
  return (
    <div className={style.container}>
      <div className={style.text}>
        <h1>Art is evolving, and we were born to witness it.</h1>
        <div className={style.description}>
          fxhash is an open platform to create and collect generative NFTs on
          the tezos blockchain
        </div>
      </div>
      <div className={style.stuff}>component</div>
    </div>
  )
}

export const HomeHero = memo(_HomeHero)
