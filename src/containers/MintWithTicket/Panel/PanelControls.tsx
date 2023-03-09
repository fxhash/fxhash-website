import style from "./PanelControls.module.scss"
import {
  BaseButton,
  BaseInput,
  IconButton,
} from "components/FxParams/BaseInput"

import {
  faArrowLeft,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props {
  withAutoUpdate: boolean
  onChangeWithAutoUpdate: (state: boolean) => void
  onClickBack?: () => void
  onOpenNewTab?: () => void
  onSubmit: () => void
  submitLabel?: string
}

export function PanelControls(props: Props) {
  const {
    withAutoUpdate,
    onChangeWithAutoUpdate,
    onClickBack,
    onOpenNewTab,
    onSubmit,
    submitLabel = "mint",
  } = props

  return (
    <div className={style.controlPanel}>
      <div className={style.checkboxWrapper}>
        <BaseInput
          id="updateCheckbox"
          type="checkbox"
          checked={withAutoUpdate}
          onChange={() => onChangeWithAutoUpdate(!withAutoUpdate)}
        />
        <label htmlFor="updateCheckbox">auto-apply on settings update</label>
      </div>
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
