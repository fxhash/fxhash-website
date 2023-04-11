import {
  GenerativeToken,
  GenTokFlag,
} from "../../types/entities/GenerativeToken"
import { FlagBanner } from "../../components/Flag/FlagBanner"

export function getFlagText(flag: GenTokFlag): string {
  switch (flag) {
    case GenTokFlag.AUTO_DETECT_COPY:
      return "The fxhash system has automatically flagged this token as a potential copymint. The moderation team has not yet stated if it respects the Guidelines of the platform. Please wait until a decision is taken."
    case GenTokFlag.MALICIOUS:
      return "This token was flagged as undesirable content by the moderation team."
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
export function GenerativeFlagBanner({ token }: Props) {
  const flagged = [
    GenTokFlag.AUTO_DETECT_COPY,
    GenTokFlag.MALICIOUS,
    GenTokFlag.REPORTED,
    GenTokFlag.HIDDEN,
  ].includes(token.flag)

  return flagged ? (
    <FlagBanner>
      <h4>Warning ! This Generative Token has been flagged</h4>
      <p>{getFlagText(token.flag)}</p>
      {token.moderationReason && (
        <span>
          <strong>Reason</strong>: {token.moderationReason}
        </span>
      )}
    </FlagBanner>
  ) : null
}
