import style from "./GenerativeTokenCard.module.scss"
import Link from "next/link"
import cs from "classnames"
import {
  GenerativeToken,
  GenTokLabel,
  GenTokLabelGroup,
  GenTokLabel_Params,
} from "../../types/entities/GenerativeToken"
import colors from "../../styles/Colors.module.css"
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
import { Label } from "components/GenerativeToken/Label/Label"

interface Props {
  token: GenerativeToken
  className?: string
  displayPrice?: boolean
  displayDetails?: boolean
  lockedUntil?: string
  positionMintingState?: "top" | "inside"
}

export function GenerativeTokenCard({
  token,
  displayPrice = false,
  displayDetails = true,
  className,
  positionMintingState = "inside",
  lockedUntil,
}: Props) {
  const url = getGenerativeTokenUrl(token)
  return (
    <Link href={url} passHref>
      <AnchorForward className={cs(className, style.anchor)}>
        <>
          {token.balance > 0 && positionMintingState === "top" && (
            <div className={cs(style.minting_state_top)}>
              <MintingState token={token} />
            </div>
          )}
          <Card
            className={style.card}
            tokenLabels={token.labels}
            image={token.captureMedia}
            thumbnailUri={token.thumbnailUri}
            displayDetails={displayDetails}
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
          >
            <div>
              <h5 className={style.title}>{token.name}</h5>
              <Spacing size="2x-small" sm="x-small" />
              <EntityBadge user={token.author} size="regular" hasLink={false} />
              <Spacing size="2x-small" sm="x-small" />
              {token.balance > 0 && positionMintingState === "inside" && (
                <MintingState token={token} />
              )}

              {token.inputBytesSize > 0 && (
                <div className={cs(style.labels)}>
                  <Label definition={GenTokLabel_Params} />
                </div>
              )}
            </div>

            <div className={style.mint_progress}>
              <MintProgress token={token}>
                {displayPrice && (
                  <div>
                    <strong className={cs(colors.secondary, text.regular)}>
                      <DisplayTezos
                        mutez={genTokCurrentPrice(token)}
                        formatBig={false}
                        tezosSize="regular"
                      />
                    </strong>
                    {!!token.pricingDutchAuction && (
                      <i
                        className={cs(
                          "fa-solid fa-arrow-down-right",
                          colors["gray-light"],
                          style.mint_progress_icon
                        )}
                      />
                    )}
                  </div>
                )}
              </MintProgress>
            </div>
          </Card>
        </>
      </AnchorForward>
    </Link>
  )
}
