import style from "./InputReserveWhitelist.module.scss"
import cs from "classnames"
import { InputProps } from "../../../types/Inputs"
import { TInputReserveProps } from "./InputReserve"
import { InputSplits } from "../InputSplits"
import { transformSplitsAccessList } from "../../../utils/transformers/splits"
import { Button } from "../../Button"
import { useCallback, useState } from "react"
import { ProjectHolders } from "../ProjectHolders/ProjectHolders"
import { ISplit } from "../../../types/entities/Split"
import { ModalImportCsvReserve } from "../../ModalImportCsv/ModalImportCsvReserve"

export function InputReserveWhitelist({
  value,
  onChange,
  children,
}: TInputReserveProps<any>) {
  // the select holders modal
  const [showAddHoldersModal, setShowAddHoldersModal] = useState(false)
  const [showImportCsvModal, setShowImportCsvModal] = useState(false)

  const handleToggleAddHoldersModal = useCallback(
    (newState) => () => setShowAddHoldersModal(newState),
    []
  )
  const handleToggleImportCsvModal = useCallback(
    (newState) => () => setShowImportCsvModal(newState),
    []
  )
  const handleImportHolders = useCallback(
    (addSplits) => (splits: ISplit[]) => {
      addSplits(splits)
      setShowAddHoldersModal(false)
    },
    []
  )
  const handleImportCsv = useCallback(
    (addSplits) => (splits: ISplit[]) => {
      addSplits(splits)
      setShowImportCsvModal(false)
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
            {showAddHoldersModal && (
              <ProjectHolders
                onClose={handleToggleAddHoldersModal(false)}
                onImport={handleImportHolders(addSplits)}
              />
            )}
            {showImportCsvModal && (
              <ModalImportCsvReserve
                onClose={handleToggleImportCsvModal(false)}
                onImport={handleImportCsv(addSplits)}
              />
            )}
          </div>
        )}
      </InputSplits>
    </div>
  )
}
