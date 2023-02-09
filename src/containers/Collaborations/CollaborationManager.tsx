import style from "./CollaborationManager.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { Collaboration, User } from "../../types/entities/User"
import { useIndexer } from "../../hooks/useIndexer"
import {
  CollaborationContractHandler,
  CollaborationContractState,
  CollaborationProposal,
} from "../../services/indexing/contract-handlers/CollaborationHandler"
import { TabDefinition, Tabs } from "../../components/Layout/Tabs"
import { Spacing } from "../../components/Layout/Spacing"
import { LoaderBlock } from "../../components/Layout/LoaderBlock"
import { TabsContainer } from "../../components/Layout/TabsContainer"
import { useEffect, useMemo } from "react"
import { Proposals } from "../../components/Collaborations/Proposal/Proposals"
import { CollaborationInformations } from "./CollaborationInformations"

const tabs: TabDefinition[] = [
  {
    name: "operations awaiting",
  },
  {
    name: "operations executed",
  },
  {
    name: "informations",
  },
]

interface IFilteredProposals {
  awaiting: CollaborationProposal[]
  executed: CollaborationProposal[]
}

interface Props {
  collaboration: Collaboration
}
export function CollaborationManager({ collaboration }: Props) {
  const { loading, data, reIndex } = useIndexer<CollaborationContractState>(
    collaboration.id,
    CollaborationContractHandler,
    10000
  )

  const filtered = useMemo<IFilteredProposals>(() => {
    const arr = data ? Object.values(data.proposals) : []
    return {
      awaiting: arr.filter((prop) => !prop.executed),
      executed: arr.filter((prop) => prop.executed),
    }
  }, [data])

  return loading ? (
    <LoaderBlock size="small" height="25vh" />
  ) : (
    <>
      <TabsContainer tabDefinitions={tabs} tabsLayout="fixed-size">
        {({ tabIndex }) => (
          <>
            <Spacing size="3x-large" />

            <main className={cs(layout["padding-big"])}>
              {tabIndex === 0 ? (
                <Proposals
                  proposals={filtered.awaiting}
                  collaboration={collaboration}
                  showOldSettings={true}
                  onAction={() => reIndex()}
                />
              ) : tabIndex === 1 ? (
                <Proposals
                  proposals={filtered.executed}
                  collaboration={collaboration}
                  showOldSettings={false}
                />
              ) : (
                <CollaborationInformations
                  collaboration={collaboration}
                  state={data!}
                />
              )}
            </main>
          </>
        )}
      </TabsContainer>

      <Spacing size="6x-large" />
    </>
  )
}
