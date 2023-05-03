import React, { memo, useCallback, useContext, useMemo, useState } from "react"
import { Objkt } from "../../types/entities/Objkt"
import { Modal } from "../Utils/Modal"
import style from "./ModalUserCollection.module.scss"

import { InputSearchUser } from "../Input/InputSearchUser"
import { Spacing } from "../Layout/Spacing"
import { User } from "../../types/entities/User"
import { UserBadge } from "../User/UserBadge"
import { isTezosAddress } from "../../utils/strings"
import { Button } from "../Button"
import { useContractOperation } from "../../hooks/useContractOperation"
import { ContractFeedback } from "../Feedback/ContractFeedback"
import {
  TransferGentkOperation,
  TTransferGentkOperationParams,
} from "../../services/contract-operations/TransferGentk"
import { UserContext } from "../../containers/UserProvider";

interface ModalTransferGentkProps {
  objkt: Objkt
  onClose: () => void
}

const _ModalTransferGentk = ({ objkt, onClose }: ModalTransferGentkProps) => {
  const { user } = useContext(UserContext)
  const {
    state,
    loading: contractLoading,
    error: contractError,
    success,
    call,
  } = useContractOperation<TTransferGentkOperationParams>(
    TransferGentkOperation,
    {
      onSuccess: onClose,
    }
  )
  const [searchValue, setSearchValue] = useState("")
  const [fetchedUsers, setFetchedUsers] = useState<User[]>([])
  const handleSelectUser = useCallback((tzAddress) => {
    setSearchValue(tzAddress)
  }, [])

  const userSelected = useMemo(() => {
    return fetchedUsers.find((user) => user.id === searchValue)
  }, [fetchedUsers, searchValue])
  const callContract = useCallback(() => {
    if (user) {
      call({
        objkt,
        fromTzAddress: user.id,
        toTzAddress: searchValue,
        toUsername: userSelected ? userSelected.name : undefined,
      })
    }
  }, [call, objkt, searchValue, user, userSelected])
  const hasValidAddress = isTezosAddress(searchValue)
  return (
    <Modal
      title={`Transfer "${objkt.name}" to a tezos address`}
      onClose={onClose}
      width="600px"
    >
      <div className={style.container}>
        <div>
          Please enter a valid tezos address or search by username to transfer
          your gentk.
        </div>
        <Spacing size="regular" />
        <div className={style.container_search}>
          <div className={style.container_search_row}>
            <InputSearchUser
              value={searchValue}
              onChange={handleSelectUser}
              displayAddress
              onFetchUsers={setFetchedUsers}
            />
            <Button
              state={contractLoading ? "loading" : "default"}
              color="secondary"
              onClick={callContract}
              size="regular"
              disabled={!hasValidAddress}
              className={style.btn_transfer}
            >
              <i aria-hidden className="fa-solid fa-arrow-right-arrow-left" />
              transfer
            </Button>
          </div>
          {hasValidAddress && (
            <>
              <Spacing size="regular" />
              <div>
                You will transfer your gentk to{" "}
                {userSelected ? (
                  <UserBadge
                    user={userSelected}
                    hasLink
                    displayAvatar={false}
                  />
                ) : (
                  <span className={style.tz_address}>{searchValue}</span>
                )}
                {"."}
              </div>
            </>
          )}
          {(contractLoading || success || contractError) && (
            <>
              <Spacing size="x-small" />
              <ContractFeedback
                state={state}
                loading={contractLoading}
                success={success}
                error={contractError}
                successMessage="Your Gentk has been transfered"
                noSpacing
              />
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}

export const ModalTransferGentk = memo(_ModalTransferGentk)
