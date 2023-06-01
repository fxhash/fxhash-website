import React, { memo } from "react"
import { Objkt } from "../../types/entities/Objkt"
import { Modal } from "../Utils/Modal"
import style from "./ModalUserCollection.module.scss"

import { Spacing } from "../Layout/Spacing"
import { ListingCancel } from "../../containers/Objkt/ListingCancel"

interface ModalCancelListingProps {
  objkt: Objkt
  onClose: () => void
}

const _ModalCancelListing = ({ objkt, onClose }: ModalCancelListingProps) => {
  return (
    <Modal
      title={`Cancel listing for "${objkt.name}"`}
      onClose={onClose}
      width="490px"
    >
      <div className={style.container}>
        <div>Are you sure you want to cancel the listing?</div>
        <Spacing size="regular" />
        <div className={style.container_create}>
          <ListingCancel
            listing={objkt.activeListing!}
            objkt={objkt}
            onSuccess={onClose}
          />
        </div>
      </div>
    </Modal>
  )
}

export const ModalCancelListing = memo(_ModalCancelListing)
