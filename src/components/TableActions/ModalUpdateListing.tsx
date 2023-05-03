import React, { memo, useCallback, useState } from "react"
import { Objkt } from "../../types/entities/Objkt"
import { Modal } from "../Utils/Modal"
import style from "./ModalUserCollection.module.scss"
import colors from "../../styles/Colors.module.css"

import { Spacing } from "../Layout/Spacing"
import { ListingUpsert } from "../../containers/Objkt/ListingUpsert"
import { DisplayTezos } from "../Display/DisplayTezos"
import cs from "classnames"

interface ModalUpdateListingProps {
  objkt: Objkt
  onClose: () => void
}

const _ModalUpdateListing = ({ objkt, onClose }: ModalUpdateListingProps) => {
  const [newPrice, setNewPrice] = useState<number | null>(null)
  const handleChangePrice = useCallback((updatedPrice) => {
    setNewPrice(parseFloat(updatedPrice) * 1000000)
  }, [])

  const currentPrice = objkt.activeListing?.price || 0
  const percent = newPrice
    ? ((newPrice - currentPrice) / (currentPrice || 1)) * 100
    : null
  return (
    <Modal
      title={`Update listing for "${objkt.name}"`}
      onClose={onClose}
      width="530px"
    >
      <div className={style.container}>
        <div>Which price would you like to set your listing ?</div>
        <Spacing size="regular" />
        <div className={style.container_create}>
          <ListingUpsert
            objkt={objkt}
            defaultPrice={currentPrice / 1000000}
            onSuccess={onClose}
            onChangePrice={handleChangePrice}
          />
        </div>
        {newPrice ? (
          <div>
            <Spacing size="regular" />
            <span>
              <DisplayTezos
                mutez={currentPrice}
                formatBig={false}
                tezosSize="regular"
                className={style.tezos}
              />
              {" => "}
              <DisplayTezos
                mutez={newPrice}
                formatBig={false}
                tezosSize="regular"
                className={style.tezos}
              />
              {percent !== null && (
                <span
                  className={cs({
                    [colors.success]: percent > 0,
                    [colors.error]: percent < 0,
                    [colors.gray]: percent === 0,
                  })}
                >
                  {" ("}
                  {percent > 0 ? "+" : ""}
                  {percent?.toFixed(2)}%)
                </span>
              )}
            </span>
          </div>
        ) : null}
      </div>
    </Modal>
  )
}

export const ModalUpdateListing = memo(_ModalUpdateListing)
