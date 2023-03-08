import React, { memo, useCallback, useState } from "react"
import { Button } from "../Button"
import { MintTicket } from "../../types/entities/MintTicket"
import { DisplayTezos } from "../Display/DisplayTezos"
import { ModalClaimMintTicket } from "./ModalClaimMintTicket"

interface ButtonClaimMintTicketProps {
  mintTicket: MintTicket
}

const _ButtonClaimMintTicket = ({ mintTicket }: ButtonClaimMintTicketProps) => {
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
        claim pass{" "}
        <DisplayTezos
          mutez={mintTicket.price}
          formatBig={false}
          tezosSize="regular"
        />
      </Button>
      {showModal && (
        <ModalClaimMintTicket
          mintTicket={mintTicket}
          onClose={handleToggleModal(false)}
        />
      )}
    </>
  )
}

export const ButtonClaimMintTicket = memo(_ButtonClaimMintTicket)
