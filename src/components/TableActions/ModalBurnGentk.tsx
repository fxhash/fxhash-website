import React, { memo, useCallback, useContext, useState } from "react"
import { Objkt } from "../../types/entities/Objkt"
import { Modal } from "../Utils/Modal"
import style from "./ModalUserCollection.module.scss"
import { Spacing } from "../Layout/Spacing"
import { Button } from "../Button"
import { useContractOperation } from "../../hooks/useContractOperation"
import { ContractFeedback } from "../Feedback/ContractFeedback"
import { UserContext } from "../../containers/UserProvider"
import {
  BurnGentkOperation,
  TBurnGentkOperationParams,
} from "../../services/contract-operations/BurnGentk"
import { TextWarning } from "../Text/TextWarning"
import { Checkbox } from "../Input/Checkbox"

interface ModalBurnGentkProps {
  objkt: Objkt
  onClose: () => void
}

const _ModalBurnGentk = ({ objkt, onClose }: ModalBurnGentkProps) => {
  const [hasAccept, setHasAccept] = useState(false)
  const { user } = useContext(UserContext)
  const {
    state,
    loading: contractLoading,
    error: contractError,
    success,
    call,
  } = useContractOperation<TBurnGentkOperationParams>(BurnGentkOperation, {
    onSuccess: onClose,
  })
  const callContract = useCallback(() => {
    if (user) {
      call({
        objkt,
        fromTzAddress: user.id,
      })
    }
  }, [call, objkt, user])
  return (
    <Modal title={`Burn "${objkt.name}"`} onClose={onClose} width="490px">
      <div className={style.container}>
        <div>Are you sure you want to burn your gentk?</div>
        <Spacing size="2x-small" />
        <TextWarning>This action is irreversible.</TextWarning>
        <Spacing size="regular" />
        <Checkbox value={hasAccept} onChange={setHasAccept} paddingLeft={false}>
          I understand that my gentk will be permanently deleted.
        </Checkbox>
        <Button
          state={contractLoading ? "loading" : "default"}
          color="primary"
          onClick={callContract}
          size="regular"
          className={style.btn_full}
          disabled={!hasAccept}
        >
          <i aria-hidden className="fa-solid fa-fire" />
          burn
        </Button>
        {(contractLoading || success || contractError) && (
          <>
            <Spacing size="x-small" />
            <ContractFeedback
              state={state}
              loading={contractLoading}
              success={success}
              error={contractError}
              successMessage="Your gentk has been burn"
              noSpacing
            />
          </>
        )}
      </div>
    </Modal>
  )
}

export const ModalBurnGentk = memo(_ModalBurnGentk)
