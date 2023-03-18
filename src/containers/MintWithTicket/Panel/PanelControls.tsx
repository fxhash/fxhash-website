import style from "./PanelControls.module.scss"
import { BaseButton, IconButton } from "components/FxParams/BaseInput"

import {
  faArrowLeft,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props {
  onClickBack?: () => void
  onOpenNewTab?: () => void
  onSubmit: () => void
  submitLabel?: string
}

export function PanelControls(props: Props) {
  const { onClickBack, onOpenNewTab, onSubmit, submitLabel = "mint" } = props

  return (
    <div className={style.controlPanel}>
      <div className={style.buttonsWrapper}>
        {onClickBack && (
          <IconButton onClick={onClickBack} title="go back to project page">
            <FontAwesomeIcon icon={faArrowLeft} />
          </IconButton>
        )}
        {onOpenNewTab && (
          <IconButton
            onClick={onOpenNewTab}
            title="open this variant into a new tab"
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </IconButton>
        )}
        <BaseButton
          color="main"
          onClick={onSubmit}
          className={style.submitButton}
          title={submitLabel}
        >
          {submitLabel}
        </BaseButton>
      </div>
    </div>
  )
}
