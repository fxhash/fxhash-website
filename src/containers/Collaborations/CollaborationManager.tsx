import style from "./CollaborationManager.module.scss"
import cs from "classnames"
import { Collaboration, User } from "../../types/entities/User"
import { useIndexer } from "../../hooks/useIndexer"
import { CollaborationContractHandler, CollaborationContractState } from "../../services/indexing/contract-handlers/CollaborationHandler"

interface Props {
  collaboration: Collaboration
}
export function CollaborationManager({
  collaboration,
}: Props) {

  const { loading, data } = useIndexer<CollaborationContractState>(
    collaboration.id,
    CollaborationContractHandler
  )

  console.log({ loading, data })

  return (
    <div>hello</div>
  )
}