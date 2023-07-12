import React, { memo, useMemo, useState } from "react"
import style from "./HomeHero.module.scss"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { RandomIterativeCycler } from "./RandomIterativeCycler"
import { ProgressText } from "../../components/ProgressText/ProgressText"
import colors from "../../styles/Colors.module.css"
import { ConnectWithUs } from "../../components/ConnectWithUs/ConnectWithUs"

interface HomeHeroProps {
  randomGenerativeToken: GenerativeToken | null
}

const _HomeHero = ({ randomGenerativeToken }: HomeHeroProps) => {
  const randomGenerativeTokenWithDups = useMemo(() => {
    // duplicate objkts when only two to have a pretty infinite loop
    if (randomGenerativeToken?.objkts.length !== 2) {
      return randomGenerativeToken
    }
    const [objkt1, objkt2] = randomGenerativeToken.objkts
    return {
      ...randomGenerativeToken,
      objkts: [
        objkt1,
        objkt2,
        { ...objkt1, id: `${objkt1.id}-dup` },
        { ...objkt2, id: `${objkt2.id}-dup` },
      ],
    }
  }, [randomGenerativeToken])
  const [cursor, setCursor] = useState(0)
  const percent = useMemo(() => {
    const nbObjkts = randomGenerativeTokenWithDups?.objkts.length || 0
    return Math.floor(((cursor + 1) * 100) / nbObjkts)
  }, [cursor, randomGenerativeTokenWithDups?.objkts.length])
  return (
    <>
      <div className={style.container}>
        <div className={style.left}>
          <div className={style.text}>
            <h1>
              Art is <ProgressText percent={percent}>evolving</ProgressText>
            </h1>
            <div className={style.description}>
              The <span className={colors.blue}>tezos</span> platform for
              artists and collectors to live out their passion for{" "}
              <span className={colors.primary}>generative&nbsp;art</span>.
            </div>
            <div className={style.socials}>
              <ConnectWithUs />
            </div>
          </div>
        </div>
        <div className={style.right}>
          <div>
            {randomGenerativeTokenWithDups && (
              <RandomIterativeCycler
                generativeToken={randomGenerativeTokenWithDups}
                onChangeCursor={setCursor}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export const HomeHero = memo(_HomeHero)
