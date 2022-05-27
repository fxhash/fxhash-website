import style from "./InputReserveWhitelist.module.scss"
import cs from "classnames"
import { InputProps } from "../../../types/Inputs"
import { TInputReserveProps } from "./InputReserve"
import { InputSplits } from "../InputSplits"
import { transformSplitsAccessList } from "../../../utils/transformers/splits"
import { Button } from "../../Button"
import { useState } from "react"
import { ProjectHolders } from "../ProjectHolders/ProjectHolders"


export function InputReserveWhitelist({
  value,
  onChange,
  children,
}: TInputReserveProps<any>) {
  // the select holders modal
  const [holdersModal, setHoldersModal] = useState(false)

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
              iconComp={<i className="fa-solid fa-plus" aria-hidden/>}
              onClick={() => setHoldersModal(true)}
            >
              add current holders of a project
            </Button>

            {holdersModal && (
              <ProjectHolders
                onClose={() => setHoldersModal(false)}
                onImport={(splits) => {
                  addSplits(splits)
                  setHoldersModal(false)
                }}
              />
            )}
          </div>
        )}
      </InputSplits>
    </div>
  )
}