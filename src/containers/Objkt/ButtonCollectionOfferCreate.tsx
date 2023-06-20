import React, { useCallback, useState } from "react"
import { Button } from "../../components/Button"
import { GenerativeToken } from "types/entities/GenerativeToken"
import { ModalCollectionOfferCreate } from "./ModalCollectionOfferCreate"
import style from "./MarketplaceActions.module.scss"

interface Props {
  token: GenerativeToken
  floor?: number | null
}

export function ButtonCollectionOfferCreate({ token, floor }: Props) {
  const [showModal, setShowModal] = useState(false)
  const handleToggleModal = useCallback(
    (newState) => () => setShowModal(newState),
    []
  )
  return (
    <>
      <Button
        color={"secondary"}
        onClick={handleToggleModal(true)}
        size="small"
        className={style.button_collection_offer}
      >
        <i aria-hidden className="fa-solid fa-rectangle-history" />
        make collection offer
      </Button>
      {showModal && (
        <ModalCollectionOfferCreate
          floor={floor}
          token={token}
          onClose={handleToggleModal(false)}
        />
      )}
    </>
  )
}
