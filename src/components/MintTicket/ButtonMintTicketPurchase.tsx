import React, { memo, useCallback, useState } from "react"
import { Button } from "../Button"
import { MintTicket } from "../../types/entities/MintTicket"
import { DisplayTezos } from "../Display/DisplayTezos"
import { Modal } from "../Utils/Modal"
import style from "./MintTicketModal.module.scss"
import text from "../../styles/Text.module.css"

interface ButtonMintTicketPurchaseProps {
  mintTicket: MintTicket
}

const _ButtonMintTicketPurchase = ({
  mintTicket,
}: ButtonMintTicketPurchaseProps) => {
  const [showModal, setShowModal] = useState(false)
  const handleToggleModal = useCallback(
    (newState) => () => setShowModal(newState),
    []
  )
  return (
    <>
      <Button
        type="button"
        color="secondary"
        size="small"
        onClick={handleToggleModal(true)}
      >
        mint ticket
      </Button>
      {showModal && (
        <Modal
          title={`You have purchased a mint ticket for “${mintTicket.token?.name}”`}
          onClose={handleToggleModal(false)}
        >
          <p className={style.p}>
            Lorem ipsum dolor sit amet consectetur. Vulputate tristique
            malesuada auctor sit duis nunc vel. Viverra nibh felis massa montes
            tincidunt nisl tempus amet cursus. Eu vitae nulla est platea morbi
            molestie eu ut. Varius elementum viverra cursus facilisis tincidunt
            pellentesque ultrices vitae. At at diam ac id tortor dolor lobortis.
            Ultrices turpis non mauris iaculis interdum metus diam tristique
            volutpat. Enim sed mauris consectetur venenatis feugiat enim mi. Ac
            potenti maecenas aliquet consectetur duis. In arcu convallis vel
            feugiat dolor varius risus.
          </p>
          <div className={style.container_inputs}>
            <div className={style.container_input}>
              <label>
                <div className={style.label_title_regular}>Gracing period</div>
                <div className={style.label_subtitle}>
                  Your pass cannot be claimed during this period even of you
                  don’t pay a tax
                </div>
              </label>
              <div className={text.bold}>
                {mintTicket.settings.gracingPeriod} days
              </div>
            </div>
            <div className={style.container_input}>
              <label>
                <div className={style.label_title_regular}>Current price</div>
                <div className={style.label_subtitle}>
                  Based on the mint price, you can change it based on what you
                  want to pay as a tax
                </div>
              </label>
              <div className={text.bold}>
                <DisplayTezos
                  mutez={mintTicket.price}
                  formatBig={false}
                  tezosSize="regular"
                />
              </div>
            </div>
          </div>
          <div className={style.container_buttons}>
            <Button type="button" size="small">
              update the price
            </Button>
            <Button type="button" color="secondary" size="small">
              mint your iteration
            </Button>
          </div>
        </Modal>
      )}
    </>
  )
}

export const ButtonMintTicketPurchase = memo(_ButtonMintTicketPurchase)
