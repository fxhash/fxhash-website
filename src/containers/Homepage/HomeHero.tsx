import React, { memo, useMemo, useState } from "react"
import style from "./HomeHero.module.scss"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { Button } from "../../components/Button"
import Link from "next/link"
import { RandomIterativeCycler } from "./RandomIterativeCycler"
import { ProgressText } from "../../components/ProgressText/ProgressText"

interface HomeHeroProps {
  randomGenerativeToken: GenerativeToken | null
}
const _HomeHero = ({ randomGenerativeToken }: HomeHeroProps) => {
  const [cursor, setCursor] = useState(0)
  const percent = useMemo(() => {
    const nbObjkts = randomGenerativeToken?.objkts.length || 0
    return Math.floor(((cursor + 1) * 100) / nbObjkts)
  }, [cursor, randomGenerativeToken?.objkts.length])
  return (
    <div className={style.container}>
      <div className={style.text}>
        <h1>
          Art is <ProgressText percent={percent}>evolving</ProgressText>, and we
          were were born to witness it.
        </h1>
        <div className={style.description}>
          fxhash is an open platform to create and collect generative NFTs on
          the tezos blockchain
        </div>
        <Link href="/doc" passHref>
          <Button
            isLink
            color="secondary"
            size="regular"
            className={style.button}
          >
            guide for fxhash
          </Button>
        </Link>
        <div className={style.articles}>
          <div>
            <h6>article</h6>
            <Link href="/doc/fxhash/overview">
              <a>
                <span>What is generative art?</span>
                <i aria-hidden="true" className="fas fa-arrow-right" />
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className={style.right}>
        {randomGenerativeToken && (
          <RandomIterativeCycler
            generativeToken={randomGenerativeToken}
            onChangeCursor={setCursor}
          />
        )}
      </div>
    </div>
  )
}

export const HomeHero = memo(_HomeHero)
