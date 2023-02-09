import style from "./CollaborationInformations.module.scss"
import cs from "classnames"
import { Collaboration } from "../../types/entities/User"
import { CollaborationContractState } from "../../services/indexing/contract-handlers/CollaborationHandler"
import { useMemo } from "react"
import { Split } from "../../types/entities/Split"
import { ListSplits } from "../../components/List/ListSplits"
import { Spacing } from "../../components/Layout/Spacing"
import { DisplayTezos } from "../../components/Display/DisplayTezos"
import { LinkIcon } from "../../components/Link/LinkIcon"
import { Button } from "../../components/Button"
import { useContractOperation } from "../../hooks/useContractOperation"
import { CollabWithdrawOperation } from "../../services/contract-operations/CollabWithdraw"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"

interface Props {
  collaboration: Collaboration
  state: CollaborationContractState
}
export function CollaborationInformations({ collaboration, state }: Props) {
  // turn shares into a list of splits
  const splits = useMemo<Split[]>(() => {
    const sum = Object.values(state.shares).reduce((a, b) => a + b, 0)
    return Object.keys(state.shares).map((share) => ({
      pct: Math.floor((state.shares[share] / sum) * 1000),
      user: collaboration.collaborators.find((c) => c.id === share)!,
    }))
  }, [state, collaboration])

  // withdraw funds op
  const {
    state: callState,
    loading,
    success,
    error,
    call,
  } = useContractOperation(CollabWithdrawOperation)

  return (
    <div>
      <h5>Additionnal information</h5>

      <Spacing size="large" />

      <div className={cs(style.root)}>
        <strong>Address</strong>
        <LinkIcon
          iconComp={<i aria-hidden className="fas fa-external-link-square" />}
          href={`https://tzkt.io/${collaboration.id}`}
          newTab
        >
          {collaboration.id}
        </LinkIcon>
        <ListSplits name="Shares" splits={splits} toggled />
        <strong>Contract balance</strong>
        <DisplayTezos
          mutez={state.balance!}
          formatBig={false}
          tezosSize="regular"
        />
      </div>

      <Spacing size="regular" />
      <ContractFeedback
        state={callState}
        loading={loading}
        success={success}
        error={error}
        successMessage="Balance withdrawn !"
      />
      <Button
        type="button"
        size="small"
        disabled={state.balance! === 0}
        state={loading ? "loading" : "default"}
        onClick={() => {
          call({
            collaboration,
          })
        }}
      >
        withdraw funds (split with shares)
      </Button>
    </div>
  )
}
