import style from "./Proposals.module.scss"
import colors from "../../../styles/Colors.module.css"
import cs from "classnames"
import { CollaborationProposal } from "../../../services/indexing/contract-handlers/CollaborationHandler"
import { Proposal } from "./Proposal"
import { Collaboration, User } from "../../../types/entities/User"
import { useMemo } from "react"

interface Props {
  proposals: CollaborationProposal[]
  collaboration: Collaboration
  showOldSettings: boolean
}
export function Proposals({
  proposals,
  collaboration,
  showOldSettings,
}: Props) {
  const ordered = useMemo(() => {
    return [...proposals].sort((a, b) => {
      const aField: Date = a.executedAt || a.createdAt
      const bField: Date = b.executedAt || b.createdAt
      return bField.getTime() - aField.getTime()
    })
  }, [proposals])

  return (
    <>
      {ordered.length === 0 ? (
        <em className={cs(colors.gray)}>
          No operations to display
        </em>
      ):(
        <div className={cs(style.root)}>
          {ordered.map(prop => (
            <Proposal
              key={prop.id}
              proposal={prop}
              collaboration={collaboration}
              showOldSettings={showOldSettings}
            />
          ))}
        </div>
      )}
    </>
  )
}