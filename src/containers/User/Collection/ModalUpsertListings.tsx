import React, { memo, useContext, useMemo, useState } from "react"
import { Modal } from "../../../components/Utils/Modal"
import { Objkt } from "../../../types/entities/Objkt"
import style from "./ModalBatchActions.module.scss"
import { Image } from "../../../components/Image"
import { InputTextUnit } from "../../../components/Input/InputTextUnit"
import { IconTezos } from "../../../components/Icons/IconTezos"
import { useQuery } from "@apollo/client"
import { qu_Objkts } from "../../../queries/objkt"
import { Spacing } from "../../../components/Layout/Spacing"
import { UserContext } from "../../UserProvider";

interface ModalUpsertListingsProps {
  objkts: Objkt[]
  onClose: () => void
}

const _ModalUpsertListings = ({
  objkts,
  onClose,
}: ModalUpsertListingsProps) => {
  const { user } = useContext(UserContext)
  const [batchObjkts, setBatchObjkts] = useState(objkts)
  const selectedObjktIds = useMemo(() => objkts.map((objkt) => objkt.id), [])
  const { data } = useQuery<{ objkts: Objkt[] }>(qu_Objkts, {
    variables: {
      take: 50,
      skip: 0,
      filters: {
        id_in: selectedObjktIds,
      },
    },
  })
  const originalObjktsById = useMemo(() => {
    if (!data?.objkts) return {}
    return data.objkts.reduce((acc, objkt) => {
      acc[objkt.id] = objkt
      return acc
    }, {} as Record<string, Objkt>)
  }, [data])
  const renderStatus = (selectedObjkt: Objkt, originalObjkt: Objkt) => {
    if (!originalObjkt) return null
    if (originalObjkt.owner?.id !== user?.id) return <div>lost ownership</div>
    if (!originalObjkt.activeListing) return <div>new listing</div>
    return
  }
  // display "new listing" or change ex: 10tz => 5tz (-50%)
  // summary, nb new listings, nb update, total
  // validate -> refetch, check ownership, if ownership change ask to confirm, else batch actions

  return (
    <Modal title={`Add / edit multiple listings`} onClose={onClose}>
      <div>
        <div>
          You will add or update listings for the following gentks, please
          ensure that the information is correct before validating.
        </div>
        <Spacing size="regular" />
        <div className={style.gentks}>
          {batchObjkts.map((objkt) => {
            const priceValue = objkt?.activeListing?.price
              ? objkt.activeListing.price / 1000000
              : undefined

            return (
              <div className={style.gentk_container} key={objkt.id}>
                <div className={style.gentk}>
                  <div className={style.thumbnail_container}>
                    <Image
                      ipfsUri={objkt.metadata?.thumbnailUri}
                      image={objkt.captureMedia}
                      alt={`thumbnail of ${objkt.name}`}
                    />
                  </div>
                  <span className={style.container_name}>
                    <span className={style.name}>{objkt.name}</span>
                  </span>
                </div>
                <div>for</div>
                <div className={style.container_input}>
                  <InputTextUnit
                    unit={<IconTezos size="regular" />}
                    positionUnit="inside-left"
                    type="number"
                    sizeX="fill"
                    value={priceValue}
                    min={0}
                    step={0.0000001}
                  />
                </div>
                {renderStatus(objkt, originalObjktsById[objkt.id])}
              </div>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}

export const ModalUpsertListings = memo(_ModalUpsertListings)
