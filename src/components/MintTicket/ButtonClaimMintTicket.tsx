import React, { memo, useCallback, useMemo, useState } from "react"
import { Button } from "../Button"
import { MintTicket } from "../../types/entities/MintTicket"
import { DisplayTezos } from "../Display/DisplayTezos"
import { ModalClaimMintTicket } from "./ModalClaimMintTicket"
import { format, isBefore } from "date-fns"
import { HoverTitle } from "../Utils/HoverTitle"
import cs from "classnames"
import { Icon } from "../Icons/Icon"
import style from "./ButtonClaimMintTicket.module.scss"

interface ButtonClaimMintTicketProps {
  mintTicket: MintTicket
  price: number
  now: Date
}

const _ButtonClaimMintTicket = ({
  mintTicket,
  price,
  now = new Date(),
}: ButtonClaimMintTicketProps) => {
  const [showModal, setShowModal] = useState(false)
  const handleToggleModal = useCallback(
    (newState) => () => setShowModal(newState),
    []
  )
  const dateTaxationStart = useMemo(
    () => new Date(mintTicket.taxationStart),
    [mintTicket.taxationStart]
  )
  const isGracingPeriod = useMemo(() => {
    return now < dateTaxationStart
  }, [now, dateTaxationStart])
  return (
    <>
      <Button
        type="button"
        color="secondary"
        size="small"
        onClick={handleToggleModal(true)}
        disabled={isGracingPeriod}
      >
        claim pass{" "}
        <DisplayTezos mutez={price} formatBig={false} tezosSize="regular" />
      </Button>
      {isGracingPeriod && (
        <HoverTitle
          message={`Tickets can't be claim during gracing period. Period ends on ${format(
            dateTaxationStart,
            "d/MM/yy 'at' H:mm"
          )}`}
          className={cs(style.tooltip)}
        >
          <Icon icon="infos-circle" />
        </HoverTitle>
      )}
      {showModal && (
        <ModalClaimMintTicket
          mintTicket={mintTicket}
          price={price}
          onClose={handleToggleModal(false)}
        />
      )}
    </>
  )
}

export const ButtonClaimMintTicket = memo(_ButtonClaimMintTicket)
