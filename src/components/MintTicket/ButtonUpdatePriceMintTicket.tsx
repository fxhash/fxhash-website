import React, { memo, useCallback, useState } from "react"
import { Button } from "../Button"
import { MintTicket } from "../../types/entities/MintTicket"
import { DisplayTezos } from "../Display/DisplayTezos"
import { ModalUpdatePriceMintTicket } from "./ModalUpdatePriceMintTicket"

interface ButtonUpdatePriceMintTicketProps {
  mintTicket: MintTicket
}

const _ButtonUpdatePriceMintTicket = ({
  mintTicket,
}: ButtonUpdatePriceMintTicketProps) => {
  const [showModal, setShowModal] = useState(false)
  const handleToggleModal = useCallback(
    (newState) => () => setShowModal(newState),
    []
  )
  return (
    <>
      <Button
        type="button"
        color="secondary"
        size="small"
        onClick={handleToggleModal(true)}
      >
        update price (
        <DisplayTezos
          mutez={mintTicket.price}
          formatBig={false}
          tezosSize="regular"
        />
        )
      </Button>
      {showModal && (
        <ModalUpdatePriceMintTicket
          mintTicket={mintTicket}
          onClose={handleToggleModal(false)}
        />
      )}
    </>
  )
}

export const ButtonUpdatePriceMintTicket = memo(_ButtonUpdatePriceMintTicket)
