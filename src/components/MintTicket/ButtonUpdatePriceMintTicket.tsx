import React, { memo, useCallback, useState } from "react"
import { Button } from "../Button"
import { MintTicket } from "../../types/entities/MintTicket"
import { DisplayTezos } from "../Display/DisplayTezos"
import { Modal } from "../Utils/Modal"
import style from "./MintTicketModal.module.scss"
import { InputTextUnit } from "../Input/InputTextUnit"

interface ButtonUpdatePriceMintTicketProps {
  mintTicket: MintTicket
}

const _ButtonUpdatePriceMintTicket = ({
  mintTicket,
}: ButtonUpdatePriceMintTicketProps) => {
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
        update price (
        <DisplayTezos
          mutez={mintTicket.price}
          formatBig={false}
          tezosSize="regular"
        />
        )
      </Button>
      {showModal && (
        <Modal
          title={`Update price for “${mintTicket.token?.name}”`}
          onClose={handleToggleModal(false)}
        >
          <p className={style.p}>
            Lorem ipsum dolor sit amet consectetur. Vulputate tristique
            malesuada auctor sit duis nunc vel. Viverra nibh felis massa montes
            tincidunt nisl tempus amet cursus. Eu vitae nulla est platea morbi
            molestie eu ut.
          </p>
          <div className={style.title}>with the current settings:</div>
          <div className={style.row_with_unit}>
            <div className={style.row_label}>
              You will keep ownership of your pass:
            </div>
            <div className={style.unit}>8 days</div>
          </div>
          <div className={style.progress_bar}>
            <div className={style.left} />
            <div className={style.right} />
          </div>
          <div className={style.row_with_unit}>
            <div className={style.row_label}>
              Gracing period{" "}
              <span className={style.regular}>6 days 23 hours</span>
            </div>
            <div className={style.unit}>
              <span className={style.p}>Tax paid</span>{" "}
              <span>1 day 1 hours</span>
            </div>
          </div>
          <hr className={style.hr2} />
          <div className={style.container_inputs}>
            <div className={style.container_input}>
              <label htmlFor="price">
                <div className={style.label_title}>price</div>
                <div className={style.label_subtitle}>
                  Anyone paying this price can claim your pass at any time
                </div>
              </label>
              <InputTextUnit
                classNameContainer={style.input}
                sizeX="small"
                unit="tez"
                id="price"
              />
            </div>
            <div className={style.container_input}>
              <label htmlFor="days">
                <div className={style.label_title}>
                  days covered by your tax
                </div>
                <div className={style.label_subtitle}>
                  For how long do you want your token to be secured at this
                  price? Not including the gracing period.
                </div>
              </label>
              <InputTextUnit
                classNameContainer={style.input}
                sizeX="small"
                unit="days"
                id="days"
              />
            </div>
          </div>
          <hr className={style.hr} />
          <p className={style.p}>
            Based on these new settings, you (have to pay / will claim back 20
            tez)
          </p>
          <div className={style.container_buttons}>
            <Button type="button" size="small">
              update (cost:{" "}
              <DisplayTezos
                mutez={4000000}
                formatBig={false}
                tezosSize="regular"
              />
              )
            </Button>
          </div>
        </Modal>
      )}
    </>
  )
}

export const ButtonUpdatePriceMintTicket = memo(_ButtonUpdatePriceMintTicket)
