import cs from "classnames"
import style from "./UserModeration.module.scss"
import layout from "../../styles/Layout.module.scss"
import { Button } from "../../components/Button"
import { User, UserFlag, UserFlagValues } from "../../types/entities/User"
import { isUserModerator } from "../../utils/user"
import { useContext, useState } from "react"
import { UserContext } from "../UserProvider"
import { useContractCall } from "../../utils/hookts"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import { UserModerationModal } from "./UserModerationModal"
import { ModerationModal } from "../../components/Moderation/Modal/ModerationModal"
import { useContractOperation } from "../../hooks/useContractOperation"
import { ModerateOperation } from "../../services/contract-operations/Moderate"

interface Props {
  user: User
}
export function UserModeration({ user }: Props) {
  const userCtx = useContext(UserContext)
  const userConnected = userCtx.user!

  const [moderateModal, setModerateModal] = useState<boolean>(false)

  const { state, loading, success, call, error } =
    useContractOperation(ModerateOperation)

  return isUserModerator(userConnected as User) ? (
    <>
      {moderateModal && (
        <ModerationModal
          entityId={user.id}
          moderationContract="user"
          title="Moderate user account"
          infoText="You can moderate the tezos address associated with the account. It can restrict some contract features."
          flags={Object.keys(UserFlag).map((flag, idx) => ({
            label: flag,
            value: UserFlagValues[flag as UserFlag],
          }))}
          onClose={() => setModerateModal(false)}
        />
      )}
      <div>
        <ContractFeedback
          state={state}
          loading={loading}
          success={success}
          error={error}
          className={cs(style.contract_feedback)}
        />
        <div className={cs(layout.buttons_inline)}>
          <Button
            type="button"
            size="small"
            color="black"
            onClick={() => setModerateModal(true)}
          >
            moderate
          </Button>
          <Button
            type="button"
            size="small"
            color="secondary"
            onClick={() => {
              call({
                entityId: user.id,
                reason: -1,
                state: UserFlagValues[UserFlag.VERIFIED],
                contract: "user",
              })
            }}
          >
            verify
          </Button>
          <Button
            type="button"
            size="small"
            color="primary"
            onClick={() => {
              call({
                entityId: user.id,
                reason: -1,
                state: UserFlagValues[UserFlag.MALICIOUS],
                contract: "user",
              })
            }}
          >
            ban
          </Button>
        </div>
      </div>
    </>
  ) : null
}
