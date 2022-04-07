import style from "./ActionVote.module.scss"
import cs from "classnames"
import layout from "../../../../styles/Layout.module.scss"
import { CollaborationProposal } from "../../../../services/indexing/contract-handlers/CollaborationHandler"
import { Collaboration } from "../../../../types/entities/User"
import { Button } from "../../../Button"
import { useContractOperation } from "../../../../hooks/useContractOperation"
import { CollabVoteProposalOperation } from "../../../../services/contract-operations/CollabVoteProposal"
import { ContractFeedback } from "../../../Feedback/ContractFeedback"

interface Props {
  proposal: CollaborationProposal
  collaboration: Collaboration
}
export function ProposalActionVote({
  proposal,
  collaboration,
}: Props) {
  const { call, state, success, error, loading } = useContractOperation(
    CollabVoteProposalOperation
  )

  return (
    <>
      <ContractFeedback
        state={state}
        success={success}
        error={error}
        loading={loading}
        noSpacing
      />
  
      <div className={cs(layout.buttons_inline)}>
        {!loading && (<Button
          color="black"
          size="small"
          iconComp={<i aria-hidden className="fa-solid fa-check"/>}
          onClick={() => {
            call({
              proposal: proposal,
              collaboration: collaboration,
              approval: true,
            })
          }}
        >
          approve operation
        </Button>)}
        <Button
          color="black"
          size="small"
          iconComp={<i aria-hidden className="fa-solid fa-xmark"/>}
          onClick={() => {
            call({
              proposal: proposal,
              collaboration: collaboration,
              approval: false,
            })
          }}
          state={loading ? "loading" : "default"}
        >
          reject operation
        </Button>
      </div>
    </>
  )
}