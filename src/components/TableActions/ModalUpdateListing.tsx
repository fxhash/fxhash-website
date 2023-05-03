import React, { memo } from "react"
import { Objkt } from "../../types/entities/Objkt"
import { Modal } from "../Utils/Modal"
import style from "./ModalUserCollection.module.scss"

import { ListingCreate } from "../../containers/Objkt/ListingCreate"
import { Spacing } from "../Layout/Spacing"

interface ModalAddListingProps {
  objkt: Objkt
  onClose: () => void
}

const _ModalAddListing = ({ objkt, onClose }: ModalAddListingProps) => {
  return (
    <Modal title={`List for trade "${objkt.name}"`} onClose={onClose}>
      <div className={style.container}>
        <div>Which price would you like to list your gentk for ?</div>
        <Spacing size="regular" />
        <div className={style.container_create}>
          <ListingCreate objkt={objkt} defaultOpen onSuccess={onClose} />
        </div>
      </div>
    </Modal>
  )
}

export const ModalAddListing = memo(_ModalAddListing)
