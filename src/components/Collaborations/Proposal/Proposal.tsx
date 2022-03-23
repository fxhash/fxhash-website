import style from "./Proposal.module.scss"
import cs from "classnames"
import { format } from "date-fns"
import { CollaborationProposal } from "../../../services/indexing/contract-handlers/CollaborationHandler"
import { useMemo, useState } from "react"
import { ProposalDetails } from "./Details/ProposalDetails"
import { User } from "../../../types/entities/User"
import { UserBadge } from "../../User/UserBadge"

interface Props {
  proposal: CollaborationProposal
  collaborators: User[]
}
export function Proposal({
  proposal,
  collaborators,
}: Props) {
  const [expanded, setExpanded] = useState<boolean>(false)
  console.log(proposal)

  const Details = useMemo(() => {
    return ProposalDetails[proposal.callSettings.id]
  }, [])

  return (
    <div className={cs(style.root)}>
      <button
        className={cs(style.section, style.header)}
        onClick={() => setExpanded(!expanded)}
      >
        <Details.header proposal={proposal}/>
        <div>
          <span>details </span>
          <i aria-hidden className={`fa-solid fa-caret-${expanded?"up":"down"}`}/>
        </div>
      </button>

      {expanded && (
        <section className={cs(style.section)}>
          <Details.expanded proposal={proposal}/>
        </section>
      )}
  
      <section className={cs(style.section)}>
        <div className={cs(style.line)}>
          <span>Initiated by</span>
          <UserBadge
            user={collaborators.find(u => u.id === proposal.initiator)!}
            size="small"
          />
          <span>
            on {format(new Date(proposal.createdAt), "dd/MM/yyyy' at 'HH:mm")}
          </span>
        </div>
      </section>


      {proposal.executed ? (
        <section className={cs(style.execution, style.section)}>
          <i aria-hidden className="fas fa-check-circle"/>
          <span>executed by</span>
          <UserBadge
            user={collaborators.find(u => u.id === proposal.executedBy)!}
            size="small"
          />
          <span>
            on {format(new Date(proposal.executedAt!), "dd/MM/yyyy' at 'HH:mm")}
          </span>
        </section>
      ):(
        <section className={cs(style.section)}>
          list of approvals + button tp approve / reject (a check or a cross)
          button to execute if possible
        </section>
      )}
    </div>
  )
}