import style from "./InputReserveWhitelist.module.scss"
import cs from "classnames"
import { TInputReserveProps } from "./InputReserve"
import { InputSplits } from "../InputSplits"
import { transformSplitsAccessList } from "../../../utils/transformers/splits"
import { Button } from "../../Button"
import { useCallback, useState } from "react"
import { ProjectHolders } from "../ProjectHolders/ProjectHolders"
import { ISplit } from "../../../types/entities/Split"
import { ModalImportCsvReserve } from "../../ModalImportCsv/ModalImportCsvReserve"
import { ModalImportEventMinterWallets } from "../../ModalImportEventMinterWallets/ModalImportEventMinterWallets"

export function InputReserveWhitelist({
  maxSize,
  value,
  onChange,
  children,
}: TInputReserveProps<any>) {
  const [showImportFromEventModal, setShowImportFromEventModal] =
    useState(false)
  const [showAddHoldersModal, setShowAddHoldersModal] = useState(false)
  const [showImportCsvModal, setShowImportCsvModal] = useState(false)

  const handleToggleImportFromEventModal = useCallback(
    (newState) => () => setShowImportFromEventModal(newState),
    []
  )

  const handleToggleAddHoldersModal = useCallback(
    (newState) => () => setShowAddHoldersModal(newState),
    []
  )

  const handleToggleImportCsvModal = useCallback(
    (newState) => () => setShowImportCsvModal(newState),
    []
  )

  const handleImport = useCallback(
    (addSplits, hideModal) => (splits: ISplit[]) => {
      addSplits(splits)
      hideModal()
    },
    []
  )

  return (
    <div>
      {children}
      <InputSplits
        value={value}
        onChange={onChange}
        textShares="Nb of editions"
        defaultShares={1}
        sharesTransformer={transformSplitsAccessList}
        showPercentages={false}
      >
        {({ addSplits }) => (
          <div className={cs(style.last_row)}>
            <Button
              type="button"
              size="very-small"
              iconComp={<i className="fa-solid fa-plus" aria-hidden />}
              onClick={handleToggleImportFromEventModal(true)}
            >
              import from event
            </Button>
            <Button
              type="button"
              size="very-small"
              iconComp={<i className="fa-solid fa-plus" aria-hidden />}
              onClick={handleToggleImportCsvModal(true)}
            >
              import from .csv
            </Button>
            <Button
              type="button"
              size="very-small"
              iconComp={<i className="fa-solid fa-plus" aria-hidden />}
              onClick={handleToggleAddHoldersModal(true)}
            >
              add current holders of a project
            </Button>
            {showImportFromEventModal && (
              <ModalImportEventMinterWallets
                numEditions={maxSize}
                onClose={handleToggleImportFromEventModal(false)}
                onImport={handleImport(
                  addSplits,
                  handleToggleImportFromEventModal(false)
                )}
              />
            )}
            {showAddHoldersModal && (
              <ProjectHolders
                onClose={handleToggleAddHoldersModal(false)}
                onImport={handleImport(
                  addSplits,
                  handleToggleAddHoldersModal(false)
                )}
              />
            )}
            {showImportCsvModal && (
              <ModalImportCsvReserve
                onClose={handleToggleImportCsvModal(false)}
                onImport={handleImport(
                  addSplits,
                  handleToggleImportCsvModal(false)
                )}
              />
            )}
          </div>
        )}
      </InputSplits>
    </div>
  )
}
