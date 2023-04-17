import React, { memo, useCallback, useContext, useMemo, useState } from "react"
import { Button } from "../Button"
import { Modal } from "../Utils/Modal"
import style from "./ModalAcceptCollectionOffer.module.scss"
import colors from "../../styles/Colors.module.css"
import { Spacing } from "../Layout/Spacing"
import { CollectionOffer } from "types/entities/Offer"
import { Objkt } from "types/entities/Objkt"
import { useQuery } from "@apollo/client"
import { UserContext } from "containers/UserProvider"
import { Qu_userAcceptCollectionOffer } from "queries/user"
import { Image } from "components/Image"
import { Checkbox } from "components/Input/Checkbox"
import { DisplayTezos } from "components/Display/DisplayTezos"
import Link from "next/link"
import { FloorDifference } from "components/Display/FloorDifference"
import { UserBadge } from "../User/UserBadge"
import { plural } from "../../utils/strings"
import { useContractOperation } from "../../hooks/useContractOperation"
import { CollectionOfferAcceptOperation } from "../../services/contract-operations/CollectionOfferAccept"
import { ContractFeedback } from "../Feedback/ContractFeedback"

interface ModalAcceptCollectionOfferProps {
  offer: CollectionOffer | null
  onClose: () => void
}

const _ModalAcceptCollectionOffer = ({
  offer,
  onClose,
}: ModalAcceptCollectionOfferProps) => {
  const collectionOfferContract = useContractOperation(
    CollectionOfferAcceptOperation
  )

  const { user } = useContext(UserContext)
  const [selectedGentks, setSelectedGentks] = useState<Record<string, Objkt>>(
    {}
  )
  const nbSelectedGentks = useMemo(
    () => Object.keys(selectedGentks).length,
    [selectedGentks]
  )
  const isRadio = useMemo(() => offer?.amount === 1, [offer])

  const handleClickCheckboxGentk = useCallback(
    (gentk) => () => {
      // single choice
      if (isRadio) {
        setSelectedGentks((oldGentks) => {
          if (oldGentks[gentk.id]) return oldGentks
          return {
            [gentk.id]: gentk,
          }
        })
        return
      }

      // multiple choices
      if (nbSelectedGentks + 1 > (offer?.amount || 0)) return false
      setSelectedGentks((oldGentks) => {
        const updatedGentks = { ...oldGentks }
        if (updatedGentks[gentk.id]) {
          delete updatedGentks[gentk.id]
        } else {
          updatedGentks[gentk.id] = gentk
        }
        return updatedGentks
      })
    },
    [isRadio, nbSelectedGentks, offer?.amount]
  )
  const handleClickAccept = useCallback(() => {
    if (offer) {
      const tokens = Object.values(selectedGentks)
      collectionOfferContract.call({
        offer: offer,
        tokens: tokens,
        price: offer.price,
      })
    }
  }, [collectionOfferContract, offer, selectedGentks])
  const { data } = useQuery(Qu_userAcceptCollectionOffer, {
    variables: {
      userId: user?.id,
      issuerId: offer!.token.id,
    },
    skip: !offer,
    fetchPolicy: "no-cache",
  })

  const floor = data?.user?.objkts?.[0]?.issuer?.marketStats?.floor
  if (!offer) return null

  return (
    <Modal
      title={`Accept collection offer for “${offer.token.name}“`}
      onClose={onClose}
    >
      <p className={style.p}>
        <UserBadge user={offer.buyer} displayAvatar={false} /> want to acquire{" "}
        <span className={colors.secondary}>{offer.amount}</span> edition
        {plural(offer.amount)} for&nbsp;
        <DisplayTezos
          className={style.price}
          formatBig={false}
          mutez={offer.price}
          tezosSize="regular"
        />
        {offer.amount > 1 ? "/each" : ""}
        {floor && (
          <>
            {" "}
            which&nbsp;is&nbsp;
            <FloorDifference price={offer.price} floor={floor} /> of the floor
            price
          </>
        )}
        .
      </p>
      <Spacing size="regular" sm="small" />
      <p className={style.p}>
        Please Select which gentk{plural(offer.amount)} you would like to sell:
      </p>
      <Spacing size="regular" sm="small" />
      <div className={style.gentks}>
        {data?.user.objkts.map((gentk: Objkt) => {
          const isChecked = !!selectedGentks[gentk.id]
          return (
            <div
              key={gentk.id}
              className={style.gentk_container}
              onClick={handleClickCheckboxGentk(gentk)}
            >
              <Checkbox
                isRadio={isRadio}
                value={isChecked}
                onChange={handleClickCheckboxGentk(gentk)}
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
          )
        })}
      </div>
      {offer.amount > 1 && nbSelectedGentks > 0 && (
        <>
          <Spacing size="regular" />
          <div className={style.total}>
            You agree to sell{" "}
            <span className={colors.secondary}>{nbSelectedGentks}</span> edition
            {plural(nbSelectedGentks)} for&nbsp;a&nbsp;total&nbsp;of&nbsp;
            <DisplayTezos
              className={style.price}
              formatBig={false}
              mutez={nbSelectedGentks * offer.price}
              tezosSize="regular"
            />
          </div>
        </>
      )}
      <Spacing size="large" sm="small" />
      <div className={style.container_buttons}>
        {collectionOfferContract.success ? (
          <Button color="secondary" size="small" onClick={onClose}>
            close
          </Button>
        ) : (
          <Button
            color="secondary"
            size="small"
            state={collectionOfferContract.loading ? "loading" : "default"}
            disabled={nbSelectedGentks === 0}
            onClick={handleClickAccept}
          >
            accept offer
          </Button>
        )}
      </div>
      <div className={style.contract_feedback}>
        <ContractFeedback
          state={collectionOfferContract.state}
          loading={collectionOfferContract.loading}
          success={collectionOfferContract.success}
          error={collectionOfferContract.error}
        />
      </div>
    </Modal>
  )
}

export const ModalAcceptCollectionOffer = memo(_ModalAcceptCollectionOffer)
