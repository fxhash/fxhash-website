import style from "./UserActions.module.scss"
import cs from "classnames"
import { RedeemableUserAction } from "types/entities/Redeemable"
import { redeemableUserActionDefinitions } from "definitions/Redeemable/UserActions"
import { useField } from "formik"
import { useUpdateFormObject } from "hooks/useFormUpdate"
import { Spacing } from "../../Layout/Spacing";
import { Fragment } from "react";

interface Props {
  id: string
  userActions: RedeemableUserAction[]
}
export function FormRedeemableUserActions({ id, userActions }: Props) {
  const [{ value }, { error }, { setValue }] = useField(id)
  const update = useUpdateFormObject(value, setValue)

  return (
    <>
      {userActions.map((userAction, idx) => {
        const def = redeemableUserActionDefinitions[userAction.type]
        const err = (error as any)?.[userAction.id]
        return (
          <Fragment key={userAction.id}>
            <Spacing size="x-large" sm="2x-large" />
            <def.input
              value={value[userAction.id]}
              onChange={(val) => update(userAction.id, val)}
              options={userAction.options}
              error={err}
            />
          </Fragment>
        )
      })}
    </>
  )
}
