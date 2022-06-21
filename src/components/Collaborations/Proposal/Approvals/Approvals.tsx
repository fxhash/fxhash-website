import style from "./Approvals.module.scss"
import cs from "classnames"
import colors from "../../../../styles/Colors.module.css"
import { CollaborationProposal } from "../../../../services/indexing/contract-handlers/CollaborationHandler"
import { Collaboration } from "../../../../types/entities/User"
import { Fragment } from "react"
import { UserBadge } from "../../../User/UserBadge"

interface Props {
  proposal: CollaborationProposal
  collaboration: Collaboration
}
export function Approvals({
  proposal,
  collaboration,
}: Props) {
  return (
    <div className={cs(style.approvals)}>
      {collaboration.collaborators.map(user => (
        <Fragment key={user.id}>
          <UserBadge
            user={collaboration.collaborators.find(
              u => u.id === user.id
            )!}
            size="small"
          />
          <span>
            {proposal.approvals[user.id] === true ? (
              <strong className={cs(colors.success)}>
                <i aria-hidden className="fa-solid fa-circle-check"/>
                <span> approved</span>
              </strong>
            ):proposal.approvals[user.id] === false ? (
              <strong className={cs(colors.error)}>
                <i aria-hidden className="fa-solid fa-circle-xmark"/>
                <span> rejected</span>
              </strong>
            ):(
              <span className={cs(colors.gray)}>
                <i aria-hidden className="fa-solid fa-circle-question"/>
                <span> no vote yet</span>
              </span>
            )}
          </span>
        </Fragment>
      ))}
    </div>
  )
}