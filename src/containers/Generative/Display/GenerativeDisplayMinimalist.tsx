import style from "./GenerativeDisplay.module.scss"
import layout from "../../../styles/Layout.module.scss"
import text from "../../../styles/Text.module.css"
import cs from "classnames"
import { GenerativeToken } from "../../../types/entities/GenerativeToken"
import { Spacing } from "../../../components/Layout/Spacing"
import { MintController } from "../../../components/GenerativeToken/MintController"
import { format } from "date-fns"
import nl2br from "react-nl2br"
import { GenerativeArtwork } from "../../../components/GenerativeToken/GenerativeArtwork"
import { EntityBadge } from "../../../components/User/EntityBadge"
import { Labels } from "../../../components/GenerativeToken/Label/Labels"
import { MintProgress } from "../../../components/Artwork/MintProgress"

interface Props {
  generateRevealUrl?: (params: { tokenId: number, hash: string | null }) => string,
  token: GenerativeToken
  offlineMode?: boolean
}
export function GenerativeDisplayMinimalist({
  generateRevealUrl,
  token,
  offlineMode = false,
}: Props) {

  return (
    <>
      <div className={cs(style.artwork_header_mobile, layout.break_words)}>
        <EntityBadge
          user={token.author}
          size="regular"
          toggeable
        />
        <Spacing size="2x-small"/>
        <h3>{ token.name }</h3>
        <Spacing size="x-large"/>
      </div>

      <div
        className={cs(
          style.presentation, layout.cols2, layout['responsive-reverse']
        )
      }>
        <div className={cs(style.presentation_details)}>
          <div className={cs(style.artwork_header)}>
            <EntityBadge
              user={token.author}
              size="big"
              toggeable
            />
            <Spacing size="x-large"/>
            <h3>{ token.name }</h3>
          </div>
          <Spacing size="x-large" sm="none"/>
          <div className={style.centered_mint}>
            <MintController
              token={token}
              forceDisabled={offlineMode}
              generateRevealUrl={generateRevealUrl}
              className={layout.y_centered}
              forceReserveConsumption
            />
          </div>

          <Spacing size="4x-large"/>

          <div className={cs(style.multilines)}>
            <div className={cs(layout.buttons_inline)}>
              <strong>Project #{token.id}</strong>
            </div>
            <span className={cs(text.info)}>
              Published on { format(new Date(token.createdAt), "MMMM d, yyyy' at 'HH:mm") }
            </span>
            <Labels labels={token.labels!}/>
          </div>

          <Spacing size="regular"/>

          <div className={cs(style.artwork_details)}>
            <MintProgress
              token={token}
              showReserve
            />
          </div>

          <Spacing size="large"/>

          <p>{ nl2br(token.metadata?.description) }</p>

        </div>

        <div className={cs(style.presentation_artwork)}>
          <GenerativeArtwork
            token={token}
          />
        </div>
      </div>
    </>
  )
}
