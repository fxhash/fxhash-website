import style from "./EditLabelsModal.module.scss"
import cs from "classnames"
import { Modal } from "../../../components/Utils/Modal"
import {
  InputMultiList,
  MultiListItem,
} from "../../../components/Input/InputMultiList"
import { genTokLabelDefinitions } from "../../../utils/generative-token"
import {
  GenerativeToken,
  GenerativeTokenVersion,
} from "../../../types/entities/GenerativeToken"
import { useState } from "react"
import { UpdateTokenModOperation } from "../../../services/contract-operations/UpdateTokenMod"
import { useContractOperation } from "../../../hooks/useContractOperation"
import { Button } from "../../../components/Button"
import { ContractFeedback } from "../../../components/Feedback/ContractFeedback"
import { UpdateTokenModV3Operation } from "services/contract-operations/UpdateTokenModV3"

const labelsList: MultiListItem[] = Object.keys(genTokLabelDefinitions).map(
  (id) => ({
    value: parseInt(id),
    props: {
      // @ts-ignore
      label: genTokLabelDefinitions[id].label,
    },
  })
)

interface Props {
  onClose: () => void
  token: GenerativeToken
}
export function EditLabelsModal({ onClose, token }: Props) {
  const [labels, setLabels] = useState(token.labels)

  const { state, loading, success, call, error } = useContractOperation(
    token.version === GenerativeTokenVersion.PRE_V3
      ? UpdateTokenModOperation
      : UpdateTokenModV3Operation
  )

  return (
    <Modal title="Edit project labels" onClose={onClose}>
      <div className={cs(style.labels)}>
        <InputMultiList
          listItems={labelsList}
          selected={labels || []}
          onChangeSelected={setLabels}
          className={cs(style.labels_container)}
        >
          {({ itemProps }) => (
            <span className={cs(style.label)}>{itemProps.label}</span>
          )}
        </InputMultiList>
      </div>

      <div className={cs(style.buttons)}>
        <ContractFeedback
          state={state}
          success={success}
          error={error}
          loading={loading}
        />
        <Button
          type="button"
          size="small"
          color="primary"
          onClick={() => {
            call({
              token: token,
              tags: labels || [],
            })
          }}
          state={loading ? "loading" : "default"}
        >
          update
        </Button>
      </div>
    </Modal>
  )
}
