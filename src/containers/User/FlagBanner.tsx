import {
  GenerativeToken,
  GenTokFlag,
} from "../../types/entities/GenerativeToken"
import { FlagBanner } from "../../components/Flag/FlagBanner"
import { User, UserFlag } from "../../types/entities/User"

function getFlagText(flag: UserFlag): string {
  switch (flag) {
    case UserFlag.MALICIOUS:
      return "This user was flagged as malicious by the Moderators."
    case UserFlag.SUSPICIOUS:
      return "This user was flagged as suspicious by the Moderators. Their activity clearly indicates some suspicious behavior, yet some clear malicious behavior has not been proven yet."
    case UserFlag.REVIEW:
    default:
      return "This account is under review by the moderator team. Please be careful until further action is taken."
  }
}

interface Props {
  user: User
}
export function UserFlagBanner({ user }: Props) {
  const flagged = [
    UserFlag.MALICIOUS,
    UserFlag.REVIEW,
    UserFlag.SUSPICIOUS,
  ].includes(user.flag)

  return flagged ? (
    <FlagBanner>
      <h4>Warning ! This User has been flagged</h4>
      <p>{getFlagText(user.flag)}</p>
      {user.moderationReason && (
        <span>
          <strong>Reason:</strong> {user.moderationReason}
        </span>
      )}
    </FlagBanner>
  ) : null
}
