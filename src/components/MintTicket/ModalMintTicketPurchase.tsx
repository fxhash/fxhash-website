import React, { memo } from "react"
import { Modal } from "../Utils/Modal"
import style from "./MintTicketModal.module.scss"
import { Spacing } from "../Layout/Spacing"
import cs from "classnames"
import text from "../../styles/Text.module.css"
import { plural } from "../../utils/strings"
import { DisplayTezos } from "../Display/DisplayTezos"
import { Button } from "../Button"
import Link from "next/link"
import { getGenerativeTokenUrl } from "../../utils/generative-token"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { MintTicket } from "../../types/entities/MintTicket"

interface ModalMintTicketPurchaseProps {
  mintTicket: MintTicket
  onClose: () => void
  onClickUpdatePrice: () => void
}

const _ModalMintTicketPurchase = ({
  mintTicket,
  onClose,
  onClickUpdatePrice,
}: ModalMintTicketPurchaseProps) => {
  return (
    <Modal
      title={`You have purchased a mint ticket for “${mintTicket.token.name}”`}
      onClose={onClose}
    >
      <p className={style.p}>
        This ticket allows you to explore minting possibilities by playing with
        different parameter combinations.
        <br /> <br />
        When you&apos;re ready, exchange this ticket to mint an artwork with the
        parameter settings of your choice.
        <br /> <br />
        If you don&apos;t exchange this ticket for an artwork within the grace
        period, you will be required to pay a daily tax to maintain ownership of
        the ticket.
      </p>

      <Spacing size="large" />

      <div className={style.container_inputs}>
        <div className={style.container_input}>
          <label>
            <div className={style.label_title_regular}>Grace period</div>
            <div className={style.label_subtitle}>
              Your ticket can&apos;t be foreclosed on during this period and tax
              payment is not required
            </div>
          </label>
          <div className={cs(text.bold, text.h4)}>
            {mintTicket.settings.gracingPeriod} day
            {plural(mintTicket.settings.gracingPeriod)}
          </div>
        </div>
        <div className={style.container_input}>
          <label>
            <div className={style.label_title_regular}>Current price</div>
            <div className={style.label_subtitle}>
              Adjust the ticket&apos;s list price to change the tax payment
              amount
            </div>
          </label>
          <div className={cs(text.bold, text.h4)}>
            <DisplayTezos
              mutez={mintTicket.price}
              formatBig={false}
              tezosSize="regular"
            />
          </div>
        </div>
      </div>

      <Spacing size="x-large" />

      <div className={style.container_buttons}>
        <Button type="button" size="small" onClick={onClickUpdatePrice}>
          update the price
        </Button>
        <Link
          href={`${getGenerativeTokenUrl(mintTicket.token)}/ticket/${
            mintTicket.id
          }/mint`}
          passHref
        >
          <Button type="button" color="secondary" size="small" isLink>
            mint your iteration
          </Button>
        </Link>
      </div>
    </Modal>
  )
}

export const ModalMintTicketPurchase = memo(_ModalMintTicketPurchase)
