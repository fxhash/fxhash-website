import React, { memo, useCallback, useState } from "react"
import { Button } from "../Button"
import { ModalMintTicketPurchase } from "./ModalMintTicketPurchase"
import { MintTicket } from "../../types/entities/MintTicket"
import { ModalUpdatePriceMintTicket } from "./ModalUpdatePriceMintTicket"

interface ButtonMintTicketPurchaseProps {
  mintTicket: MintTicket
}

const _ButtonMintTicketPurchase = ({
  mintTicket,
}: ButtonMintTicketPurchaseProps) => {
  const [showModal, setShowModal] = useState(false)
  const [showModalUpdatePrice, setShowModalUpdatePrice] = useState(false)
  const handleToggleModal = useCallback(
    (newState) => () => setShowModal(newState),
    []
  )
  const handleCloseUpdatePrice = useCallback(
    () => setShowModalUpdatePrice(false),
    []
  )
  const handleShowUpdatePrice = useCallback(() => {
    setShowModal(false)
    setShowModalUpdatePrice(true)
  }, [])
  return (
    <>
      <Button
        type="button"
        color="secondary"
        size="regular"
        iconComp={<i aria-hidden className="fas fa-arrow-right" />}
        iconSide="right"
        onClick={handleToggleModal(true)}
      >
        see ticket
      </Button>

      {showModal && (
        <ModalMintTicketPurchase
          mintTicket={mintTicket}
          onClose={handleToggleModal(false)}
          onClickUpdatePrice={handleShowUpdatePrice}
        />
      )}
      {showModalUpdatePrice && (
        <ModalUpdatePriceMintTicket
          mintTicket={mintTicket}
          onClose={handleCloseUpdatePrice}
        />
      )}
    </>
  )
}

export const ButtonMintTicketPurchase = memo(_ButtonMintTicketPurchase)
