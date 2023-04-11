import React, { memo, useContext, useState } from "react"
import { Button } from "../Button"
import { Modal } from "../Utils/Modal"
import style from "./ModalAcceptCollectionOffer.module.scss"
import { Spacing } from "../Layout/Spacing"
import { CollectionOffer, offerTypeGuard } from "types/entities/Offer"
import { Objkt } from "types/entities/Objkt"
import { useQuery } from "@apollo/client"
import { UserContext } from "containers/UserProvider"
import { Qu_userAcceptCollectionOffer } from "queries/user"
import { Image } from "components/Image"
import { Checkbox } from "components/Input/Checkbox"
import { DisplayTezos } from "components/Display/DisplayTezos"
import Link from "next/link"
import { FloorDifference } from "components/Display/FloorDifference"

interface ModalAcceptCollectionOfferProps {
  offer: CollectionOffer
  onClose: () => void
  onClickAccept: (selectedGentk: Objkt) => void
}

const _ModalAcceptCollectionOffer = ({
  offer,
  onClose,
  onClickAccept,
}: ModalAcceptCollectionOfferProps) => {
  const { user } = useContext(UserContext)
  const [selectedGentk, setSelectedGentk] = useState<Objkt | null>(null)

  const { data, loading } = useQuery(Qu_userAcceptCollectionOffer, {
    variables: {
      userId: user?.id,
      issuerId: offer.token.id,
    },
    fetchPolicy: "no-cache",
  })

  console.log(data)
  const floor = data?.user?.objkts?.[0]?.issuer?.marketStats?.floor

  return (
    <Modal
      title={`Accept collection offer for ${offer.token.name}`}
      onClose={onClose}
    >
      <p className={style.p}>
        Select which gentk you would like to sell for&nbsp;
        <DisplayTezos
          className={style.price}
          formatBig={false}
          mutez={offer.price}
          tezosSize="regular"
        />
        &nbsp; which is&nbsp;
        <FloorDifference Element="span" price={offer.price} floor={floor} /> of
        the floor price.
      </p>
      <Spacing size="regular" />
      <div className={style.gentks}>
        {data?.user.objkts.map((gentk: Objkt) => (
          <div
            key={gentk.id}
            className={style.gentk_container}
            onClick={() => setSelectedGentk(gentk)}
          >
            <Checkbox
              value={gentk.id === selectedGentk?.id}
              onChange={() => {}}
            />
            <div className={style.gentk}>
              <div className={style.thumbnail_container}>
                <Image
                  ipfsUri={gentk.metadata?.thumbnailUri}
                  image={gentk.captureMedia}
                  alt={`thumbnail of ${gentk.name}`}
                />
              </div>
              <span className={style.container_name}>
                <span className={style.name}>{gentk.name}</span>
              </span>
            </div>
            <Link href={`/gentk/${gentk.id}`} passHref>
              <a
                target="_blank"
                rel="noopener norefere"
                className={style.linkButton}
                title="Open token in new tab"
              >
                <i className="fa-solid fa-arrow-up-right-from-square" />
              </a>
            </Link>
          </div>
        ))}
      </div>
      <Spacing size="large" />
      <div className={style.container_buttons}>
        <Button
          color="secondary"
          size="small"
          state={loading ? "loading" : "default"}
          disabled={!selectedGentk}
          onClick={() => {
            onClickAccept(selectedGentk!)
            onClose()
          }}
        >
          accept offer
        </Button>
      </div>
    </Modal>
  )
}

export const ModalAcceptCollectionOffer = memo(_ModalAcceptCollectionOffer)
