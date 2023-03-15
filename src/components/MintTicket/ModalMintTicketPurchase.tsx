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
        Lorem ipsum dolor sit amet consectetur. Vulputate tristique malesuada
        auctor sit duis nunc vel. Viverra nibh felis massa montes tincidunt nisl
        tempus amet cursus. Eu vitae nulla est platea morbi molestie eu ut.
        Varius elementum viverra cursus facilisis tincidunt pellentesque
        ultrices vitae. At at diam ac id tortor dolor lobortis. Ultrices turpis
        non mauris iaculis interdum metus diam tristique volutpat. Enim sed
        mauris consectetur venenatis feugiat enim mi. Ac potenti maecenas
        aliquet consectetur duis. In arcu convallis vel feugiat dolor varius
        risus.
      </p>

      <Spacing size="large" />

      <div className={style.container_inputs}>
        <div className={style.container_input}>
          <label>
            <div className={style.label_title_regular}>Grace period</div>
            <div className={style.label_subtitle}>
              Your ticket cannot be claimed during this period even if you don’t
              pay a tax
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
              Based on the mint price, you can change it based on what you want
              to pay as a tax
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
