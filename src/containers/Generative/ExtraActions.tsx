import style from "./ExtraActions.module.scss"
import cs from "classnames"
import { Dropdown } from "../../components/Navigation/Dropdown"
import { useContext, useState } from "react"
import { UserContext } from "../UserProvider"
import {
  GenerativeToken,
  GenerativeTokenVersion,
  GenTokFlag,
} from "../../types/entities/GenerativeToken"
import { isTokenModerator } from "../../utils/user"
import { User } from "../../types/entities/User"
import { ModerationModal } from "../../components/Moderation/Modal/ModerationModal"
import { EditLabelsModal } from "./Moderation/EditLabelsModal"
import { ReportModal } from "components/Moderation/Report/ReportModal"

function OpenButton() {
  return <i aria-hidden className="fas fa-ellipsis-h" />
}

interface Props {
  token: GenerativeToken
}
export function GenerativeExtraActions({ token }: Props) {
  const userCtx = useContext(UserContext)
  const user = userCtx.user!

  const [reportModal, setReportModal] = useState<boolean>(false)
  const [moderateModal, setModerateModal] = useState<boolean>(false)
  const [editLabelsModal, setEditLabelsModal] = useState<boolean>(false)

  return (
    <>
      {reportModal && (
        <ReportModal token={token} onClose={() => setReportModal(false)} />
      )}

      {moderateModal && (
        <ModerationModal
          entityId={token.id}
          moderationContract={
            token.version === GenerativeTokenVersion.PRE_V3
              ? "token"
              : "token_v3"
          }
          flags={Object.keys(GenTokFlag).map((flag, idx) => ({
            label: flag,
            value: idx,
          }))}
          title="Manual moderation of a Token"
          infoText='With this utility you can force the moderation of a Generative Token. This action can be reversed at any point in time. In case of a doubt, setting the flag "REPORTED" will put the Token in the "Awaiting Moderation" list for further deliberation.'
          infoState='If set to "malicious", will prevent minting on-chain'
          onClose={() => setModerateModal(false)}
        />
      )}

      {editLabelsModal && (
        <EditLabelsModal
          token={token}
          onClose={() => setEditLabelsModal(false)}
        />
      )}

      <div className={cs(style.container)}>
        <Dropdown
          itemComp={<OpenButton />}
          className={style.btns_container}
          btnClassName={style.open_btn}
          mobileMenuAbsolute
        >
          <button
            className={cs(style.btn_action)}
            onClick={() => setReportModal(true)}
          >
            <i aria-hidden className="fas fa-exclamation-triangle" />
            <span>report token</span>
          </button>

          {user && isTokenModerator(user as User) && (
            <button
              className={cs(style.btn_action)}
              onClick={() => setModerateModal(true)}
            >
              <i aria-hidden className="fas fa-gavel" />
              <span>moderate token</span>
            </button>
          )}

          {user && isTokenModerator(user as User) && (
            <button
              className={cs(style.btn_action)}
              onClick={() => setEditLabelsModal(true)}
            >
              <i aria-hidden className="fas fa-tags" />
              <span>edit labels</span>
            </button>
          )}
        </Dropdown>
      </div>
    </>
  )
}
