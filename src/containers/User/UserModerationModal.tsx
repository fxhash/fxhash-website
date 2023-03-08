import cs from "classnames"
import style from "./UserModeration.module.scss"
import { Modal } from "../../components/Utils/Modal"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import { useContractCall } from "../../utils/hookts"
import { useContext, useState } from "react"
import { UserContext } from "../UserProvider"
import { ModerateUserStateCall } from "../../types/ContractCalls"
import { Form } from "../../components/Form/Form"
import { Field } from "../../components/Form/Field"
import { Select } from "../../components/Input/Select"
import { User, UserFlag, UserFlagValues } from "../../types/entities/User"
import { Spacing } from "../../components/Layout/Spacing"
import { Button } from "../../components/Button"

interface Props {
  user: User
  onClose: () => void
}
export function UserModerationModal({ user, onClose }: Props) {
  const userCtx = useContext(UserContext)
  const [flag, setFlag] = useState<UserFlag>(UserFlag.NONE)
  const { state, loading, success, call, error } =
    useContractCall<ModerateUserStateCall>(userCtx.walletManager!.moderateUser)

  const moderate = (evt: any) => {
    evt.preventDefault()
    call({
      address: user.id,
      state: UserFlagValues[flag],
    })
  }

  return (
    <Modal title="Moderate user account" onClose={onClose}>
      <p>
        This modal lets you attribute a specific state to a user, among the list
        of all the available states.
      </p>

      <div className={cs(style.modal_bottom)}>
        <ContractFeedback
          state={state}
          loading={loading}
          success={success}
          error={error}
          successMessage="User was moderated !"
        />

        <div className={cs(style.report_btns)}>
          <Form onSubmit={moderate}>
            <Field>
              <Select
                value={flag}
                onChange={setFlag}
                options={Object.keys(UserFlag).map((flag, idx) => ({
                  label: flag,
                  value: flag,
                }))}
              />
            </Field>
            <Spacing size="x-small" />
            <Button
              color="primary"
              size="regular"
              state={loading ? "loading" : "default"}
            >
              moderate user
            </Button>
          </Form>
        </div>
      </div>
    </Modal>
  )
}
