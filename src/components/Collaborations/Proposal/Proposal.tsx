import style from "./Proposal.module.scss"
import cs from "classnames"
import { format } from "date-fns"
import { CollaborationProposal } from "../../../services/indexing/contract-handlers/CollaborationHandler"
import { useMemo, useState } from "react"
import { ProposalDetails } from "./Details/ProposalDetails"
import { Collaboration } from "../../../types/entities/User"
import { UserBadge } from "../../User/UserBadge"
import { Approvals } from "./Approvals/Approvals"
import { ProposalActionVote } from "./Actions/ActionVote"
import { ProposalActionExecute } from "./Actions/ActionExecute"
import { Spacing } from "../../Layout/Spacing"

interface Props {
  proposal: CollaborationProposal
  collaboration: Collaboration
}
export function Proposal({
  proposal,
  collaboration,
}: Props) {
  const [expanded, setExpanded] = useState<boolean>(false)

  const Details = useMemo(() => {
    return ProposalDetails[proposal.callSettings.id]
  }, [])

  return (
    <div className={cs(style.root)}>
      <button
        className={cs(style.section, style.header)}
        onClick={() => setExpanded(!expanded)}
      >
        <Details.header
          proposal={proposal}
          collaboration={collaboration}
        />
        <div>
          <span>details </span>
          <i aria-hidden className={`fa-solid fa-caret-${expanded?"up":"down"}`}/>
        </div>
      </button>

      {expanded && (
        <section className={cs(style.section)}>
          <Details.expanded
            proposal={proposal}
            collaboration={collaboration}
          />
        </section>
      )}
  
      <section className={cs(style.section)}>
        <div className={cs(style.line)}>
          <span>Initiated by</span>
          <UserBadge
            user={collaboration.collaborators.find(
              u => u.id === proposal.initiator
            )!}
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
            user={collaboration.collaborators.find(
              u => u.id === proposal.executedBy
            )!}
            size="small"
          />
          <span>
            on {format(new Date(proposal.executedAt!), "dd/MM/yyyy' at 'HH:mm")}
          </span>
        </section>
      ):(
        <>
          <section className={cs(style.section, style.section_spaced)}>
            <h6>Approvals</h6>
            <Approvals
              collaboration={collaboration}
              proposal={proposal}
            />
          </section>

          <section className={cs(style.section, style.section_spaced)}>
            <h6>Actions</h6>
            <ProposalActionVote
              collaboration={collaboration}
              proposal={proposal}
            />
            <Spacing size="small"/>
            <ProposalActionExecute
              collaboration={collaboration}
              proposal={proposal}
            />
          </section>
        </>
      )}
    </div>
  )
}