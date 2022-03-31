import style from "./ActionExecute.module.scss"
import cs from "classnames"
import layout from "../../../../styles/Layout.module.scss"
import text from "../../../../styles/Text.module.css"
import { CollaborationProposal } from "../../../../services/indexing/contract-handlers/CollaborationHandler"
import { Collaboration } from "../../../../types/entities/User"
import { Button } from "../../../Button"
import { useContractOperation } from "../../../../hooks/useContractOperation"
import { ContractFeedback } from "../../../Feedback/ContractFeedback"
import { canProposalBeExecuted } from "../../../../utils/collaboration"
import { CollabExecuteProposalOperation } from "../../../../services/contract-operations/CollabExecuteProposal"

interface Props {
  proposal: CollaborationProposal
  collaboration: Collaboration
}
export function ProposalActionExecute({
  proposal,
  collaboration,
}: Props) {
  const { call, state, success, error, loading } = useContractOperation(
    CollabExecuteProposalOperation
  )
  const canBeExecuted = canProposalBeExecuted(proposal, collaboration)

  return (
    <div className={cs(style.root)}>
      <ContractFeedback
        state={state}
        success={success}
        error={error}
        loading={loading}
        noSpacing
      />

      <div className={cs(style.bottom)}>
        <span className={cs(text.info)}>
          {canBeExecuted 
            ? "Since all the collaborators have approved the operation, any collaborator can execute it in the name of the group." 
            : "When all the collaborators will have approved the operation, it can be executed by any collaborator in the name of the whole group."
          }
        </span>
        <Button
          color="secondary"
          size="small"
          iconComp={<i aria-hidden className="fa-solid fa-sparkles"/>}
          disabled={!canBeExecuted}
          state={loading ? "loading" : "default"}
          onClick={() => call({ 
            proposal,
            collaboration,
          })}
        >
          execute operation
        </Button>
      </div>
    </div>
  )
}