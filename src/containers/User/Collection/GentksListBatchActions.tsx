import React, { memo, useCallback, useState } from "react"
import style from "./GentksListBatchActions.module.scss"
import cs from "classnames"
import { Objkt } from "../../../types/entities/Objkt"
import { Dropdown } from "../../../components/Navigation/Dropdown"
import { ModalUpsertListings } from "./ModalUpsertListings";

interface DropdownAction {
  value: string
  label: any
  type?: "warning"
}
const actionsList: Record<string, DropdownAction> = {
  transferAll: {
    label: (
      <>
        <i aria-hidden className="fa-solid fa-arrow-right-arrow-left" />
        <span>transfer all</span>
      </>
    ),
    value: "transferAll",
  },
  upsertListings: {
    label: (
      <>
        <i aria-hidden className="fa-solid fa-pen" />
        <span>add/update listings</span>
      </>
    ),
    value: "upsertListings",
  },
  cancelListings: {
    label: (
      <>
        <i aria-hidden className="fa-solid fa-ban" />
        <span>cancel listings</span>
      </>
    ),
    value: "cancelListings",
  },
  burnAll: {
    label: (
      <>
        <i aria-hidden className="fa-solid fa-fire" />
        <span>burn all</span>
      </>
    ),
    value: "burnAll",
    type: "warning",
  },
}
const actions = [
  actionsList.transferAll,
  actionsList.upsertListings,
  actionsList.cancelListings,
  actionsList.burnAll,
]

interface GentksListBatchActionsProps {
  objkts: Objkt[]
}

const _GentksListBatchActions = ({ objkts }: GentksListBatchActionsProps) => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const handleClickAction = useCallback(
    (action) => () => setSelectedAction(action),
    []
  )
  const handleCloseModal = useCallback(() => {
    setSelectedAction(null)
  }, [])
  return (
    <>
      <Dropdown
        mobileMenuAbsolute
        itemComp={
          <>
            <span>Batch action</span>
            <i aria-hidden className={`fa-solid fa-caret-up`} />
          </>
        }
        direction="top"
        btnClassName={style.open_btn}
        className={style.dropdown}
      >
        {actions.map((action) => (
          <div
            role="button"
            key={action.value}
            className={cs(style.opt, {
              [style.opt_warning]: action.type === "warning",
            })}
            onClick={handleClickAction(action.value)}
          >
            {action.label}
          </div>
        ))}
      </Dropdown>
      {selectedAction === "upsertListings" && (
        <ModalUpsertListings objkts={objkts} onClose={handleCloseModal} />
      )}
    </>
  )
}

export const GentksListBatchActions = memo(_GentksListBatchActions)
