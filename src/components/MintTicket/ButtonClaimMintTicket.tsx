import React, { memo, useCallback, useState } from "react"
import { Button } from "../Button"
import { MintTicket } from "../../types/entities/MintTicket"
import { DisplayTezos } from "../Display/DisplayTezos"
import { Modal } from "../Utils/Modal"
import { InputTextUnit } from "../Input/InputTextUnit"
import style from "./MintTicketModal.module.scss"
import colors from "../../styles/Colors.module.css";
import cs from "classnames";

interface ButtonClaimMintTicketProps {
  mintTicket: MintTicket
}

const _ButtonClaimMintTicket = ({ mintTicket }: ButtonClaimMintTicketProps) => {
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
        claim pass{" "}
        <DisplayTezos
          mutez={mintTicket.price}
          formatBig={false}
          tezosSize="regular"
        />
      </Button>
      {showModal && (
        <Modal
          title={`Claim mint pass for “${mintTicket.token?.name}”`}
          onClose={handleToggleModal(false)}
        >
          <p className={style.p}>
            Before purchasing this mint pass, you must define the price at witch
            it will appear next, as well the days during which you want to hold
            the asset. If you are going to use this pass less then 24 hours
            after your purchase, the tax will fully be reimbursed.
          </p>
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
          <div className={style.row_with_unit}>
            <div className={style.row_label}>Current price</div>
            <div className={style.unit}>
              <DisplayTezos
                mutez={4000000}
                formatBig={false}
                tezosSize="regular"
              />
            </div>
          </div>
          <div className={style.row_with_unit}>
            <div className={style.row_label}>Harberger tax</div>
            <div className={style.unit}>
              <DisplayTezos
                mutez={40000}
                formatBig={false}
                tezosSize="regular"
              />
            </div>
          </div>
          <div className={style.row_with_unit}>
            <div className={cs(style.row_label, colors.black)}>Total</div>
            <div className={style.unit}>
              <DisplayTezos
                mutez={4040000}
                formatBig={false}
                tezosSize="regular"
              />
            </div>
          </div>
          <div className={style.container_buttons}>
            <Button type="button" color="secondary" size="small">
              purchase mint pass{" "}
              <DisplayTezos
                mutez={mintTicket.price}
                formatBig={false}
                tezosSize="regular"
              />
            </Button>
          </div>
        </Modal>
      )}
    </>
  )
}

export const ButtonClaimMintTicket = memo(_ButtonClaimMintTicket)
