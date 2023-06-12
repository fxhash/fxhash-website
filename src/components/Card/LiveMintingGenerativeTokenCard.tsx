import style from "./LiveMintingGenerativeTokenCard.module.scss"
import colors from "../../styles/Colors.module.css"
import Link from "next/link"
import cs from "classnames"
import {
  GenerativeToken,
  GenTokLabel,
} from "../../types/entities/GenerativeToken"
import text from "../../styles/Text.module.css"
import { AnchorForward } from "../Utils/AnchorForward"
import { Card } from "./Card"
import { MintProgress } from "../Artwork/MintProgress"
import { Spacing } from "../Layout/Spacing"
import {
  genTokCurrentPrice,
  getGenerativeTokenUrl,
} from "../../utils/generative-token"
import { EntityBadge } from "../User/EntityBadge"
import { MintingState } from "../GenerativeToken/MintingState/MintingState"
import { DisplayTezos } from "../Display/DisplayTezos"

interface Props {
  token: GenerativeToken
  className?: string
  displayPrice?: boolean
  displayDetails?: boolean
  lockedUntil?: string
}

export function LiveMintingGenerativeTokenCard({
  token,
  displayPrice = true,
  className,
}: Props) {
  return (
    <>
      <div className={style.container}>
        <h4 className={colors.black}>{token.name}</h4>
        <Spacing size="2x-small" />
        <div className={cs(style.container_header)}>
          <EntityBadge
            user={token.author}
            size="regular"
            hasLink={false}
            className={cs(style.user_badge)}
          />
          {displayPrice && (
            <div>
              <DisplayTezos
                className={style.price}
                mutez={genTokCurrentPrice(token)}
                formatBig={false}
                tezosSize="regular"
              />
            </div>
          )}
        </div>
        <Spacing size="2x-small" />
        {token.balance > 0 && <MintingState token={token} />}
      </div>
      <div className={style.container_arrow}>
        <div className={style.container_image}>
          <Card
            tokenLabels={token.labels}
            displayDetails={false}
            thumbnailUri={token.thumbnailUri}
            thumbInfosComp={
              token.labels?.includes(GenTokLabel.INTERACTIVE) ? (
                <div className={cs(style.animated)}>
                  Interactive{" "}
                  <i className="fa-solid fa-hand-pointer" aria-hidden />
                </div>
              ) : (
                token.labels?.includes(GenTokLabel.ANIMATED) && (
                  <div className={cs(style.animated)}>
                    Animated <i className="fa-solid fa-film" aria-hidden />
                  </div>
                )
              )
            }
          />
          <div className={cs(text.small, colors.gray, style.mint_progress)}>
            <MintProgress token={token} />
          </div>
        </div>
      </div>
    </>
  )
}
