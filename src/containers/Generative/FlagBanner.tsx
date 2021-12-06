import style from "./FlagBanner.module.scss"
import cs from "classnames"
import layout from "../../styles/Layout.module.scss"
import { GenerativeToken, GenTokFlag } from "../../types/entities/GenerativeToken"


function getFlagText(flag: GenTokFlag): string {
  switch (flag) {
    case GenTokFlag.AUTO_DETECT_COPY:
      return "The fxhash system has automatically flagged this token as a potential copymint. The moderation team has not yet stated if it respects the Guidelines of the platform. Please wait until a decision is taken."
    case GenTokFlag.MALICIOUS:
      return "This token was flagged as undesirable content. It means that it doesn't follow the guidelines of the platform (copyminting, stolen content, hateful content...). The moderation team took the decision to flag this content as undesirable."
    case GenTokFlag.HIDDEN:
      return "This token was hidden, not because it doesn't follow the rules of fxhash but because an incident happened when it was released (duplicate for instance). Please consider it as non-existing."
    case GenTokFlag.REPORTED:
    default:
      return "This Generative Token has recently been reported by the community. The moderation team has not yet stated if it respects the Guidelines of the platform. Please wait until a decision is taken."
  }
}

interface Props {
  token: GenerativeToken
}
export function FlagBanner({
  token
}: Props) {
  const flagged = [GenTokFlag.AUTO_DETECT_COPY, GenTokFlag.MALICIOUS, GenTokFlag.REPORTED, GenTokFlag.HIDDEN].includes(token.flag)

  return flagged ? (
    <div className={cs(layout['padding-small'])}>
      <div className={cs(style.banner)}>
        <i aria-hidden className="fas fa-exclamation-triangle"/>
        <div>
          <h4>Warning ! This Generative Token has been flagged</h4>
          <p>{ getFlagText(token.flag) }</p>
        </div>
      </div>
    </div>
  ):null
}