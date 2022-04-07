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

interface Props {
  collaboration: Collaboration
  state: CollaborationContractState
}
export function CollaborationInformations({
  collaboration,
  state,
}: Props) {
  // turn shares into a list of splits
  const splits = useMemo<Split[]>(() => {
    const sum = Object.values(state.shares).reduce((a, b) => a+b, 0)
    return Object.keys(state.shares).map(share => ({
      pct: Math.floor(state.shares[share]/sum * 1000),
      user: collaboration.collaborators.find(
        c => c.id === share
      )!
    }))
  }, [state, collaboration])

  return (
    <div>
      <h5>Additionnal informations</h5>

      <Spacing size="large"/>

      <div className={cs(style.root)}>
        <strong>Address</strong>
        <LinkIcon
          iconComp={
            <i aria-hidden className="fas fa-external-link-square"/>
          }
          href={`https://tzkt.io/${collaboration.id}`}
          newTab
        >
          {collaboration.id}
        </LinkIcon>
        <strong>Contract balance</strong>
        <DisplayTezos
          mutez={state.balance!}
          formatBig={false}
          tezosSize="regular"
        />
        <ListSplits
          name="Shares"
          splits={splits}
          toggled
        />
      </div>
    </div>
  )
}