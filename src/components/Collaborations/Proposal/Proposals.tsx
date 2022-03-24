import style from "./Proposals.module.scss"
import colors from "../../../styles/Colors.module.css"
import cs from "classnames"
import { CollaborationProposal } from "../../../services/indexing/contract-handlers/CollaborationHandler"
import { Proposal } from "./Proposal"
import { Collaboration, User } from "../../../types/entities/User"

interface Props {
  proposals: CollaborationProposal[]
  collaboration: Collaboration
}
export function Proposals({
  proposals,
  collaboration,
}: Props) {
  return (
    <>
      {proposals.length === 0 ? (
        <em className={cs(colors.gray)}>
          No operations to display
        </em>
      ):(
        <div className={cs(style.root)}>
          {proposals.map(prop => (
            <Proposal
              key={prop.id}
              proposal={prop}
              collaboration={collaboration}
            />
          ))}
        </div>
      )}
    </>
  )
}