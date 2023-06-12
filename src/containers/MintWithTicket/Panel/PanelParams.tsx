import { PanelGroup } from "./PanelGroup"
import {
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react"
import debounce from "lodash.debounce"
import classes from "./PanelParams.module.scss"
import {
  FxParamDefinition,
  FxParamsData,
  FxParamType,
} from "components/FxParams/types"
import { LockButton } from "components/FxParams/LockButton/LockButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faFloppyDisk,
  faRotateLeft,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons"
import cx from "classnames"
import { Controls } from "components/FxParams/Controls"
import { getRandomParamValues } from "components/FxParams/utils"
import { IParamsHistoryEntry } from "components/FxParams/ParamsHistory"
import {
  BaseInput,
  BaseButton,
  IconButton,
} from "components/FxParams/BaseInput"

export interface PanelParamsProps {
  data?: FxParamsData
  params?: FxParamDefinition<FxParamType>[] | null
  onChangeData: (d: FxParamsData) => void
  onClickRefresh?: () => void
  onClickLockButton?: (id: string) => void
  onChangeLockedParamIds?: (ids: string[]) => void
  lockedParamIds?: string[]
  history?: IParamsHistoryEntry[]
  historyOffset?: number
  onUndo?: () => void
  onRedo?: () => void
  withAutoUpdate?: boolean
  onChangeWithAutoUpdate: (state: boolean) => void
  onLocalDataChange?: (d: FxParamsData) => void
  onSaveConfiguration?: () => void
  onOpenLoadConfigurationModal?: () => void
  disableOpenLoadConfigurationButton?: boolean
  disableSaveConfigurationButton?: boolean
}

export interface PanelParamsRef {
  updateData: (data: FxParamsData) => void
  getLocalData: () => FxParamsData
}

export const PanelParams = forwardRef<PanelParamsRef, PanelParamsProps>(
  (
    {
      data,
      params,
      onClickRefresh,
      onChangeData,
      onChangeLockedParamIds,
      lockedParamIds,
      history,
      historyOffset,
      onUndo,
      onRedo,
      withAutoUpdate,
      onChangeWithAutoUpdate,
      onLocalDataChange,
      onSaveConfiguration,
      onOpenLoadConfigurationModal,
      disableOpenLoadConfigurationButton,
      disableSaveConfigurationButton,
    },
    ref
  ) => {
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false)
    const withParamLocking = !!onChangeLockedParamIds
    const withHistory = !!history && !!onUndo && !!onRedo

    const allLocked = useMemo(
      () => lockedParamIds?.length === params?.length,
      [lockedParamIds?.length, params?.length]
    )

    const handleToggleLockAllParams = () => {
      if (lockedParamIds && lockedParamIds?.length > 0) {
        onChangeLockedParamIds?.([])
      } else {
        if (!params) return
        const allParamIds = params.map(
          (d: FxParamDefinition<FxParamType>) => d.id
        )
        onChangeLockedParamIds?.(allParamIds)
      }
    }

    const handleRandomizeParams = () => {
      if (!params) return
      let randomValues
      if (withParamLocking) {
        randomValues = getRandomParamValues(
          params.filter(
            (p: FxParamDefinition<FxParamType>) =>
              !lockedParamIds?.includes(p.id)
          )
        )
      } else {
        randomValues = getRandomParamValues(params)
      }
      onChangeData(randomValues)
    }

    const handleSubmitData = () => {
      onClickRefresh?.()
    }

    const handleClickLockButton = (paramId: string) => {
      if (lockedParamIds?.includes(paramId)) {
        onChangeLockedParamIds?.(lockedParamIds.filter((id) => id !== paramId))
      } else {
        onChangeLockedParamIds?.([...(lockedParamIds || []), paramId])
      }
    }

    const handleClickSaveConfiguration = () => {
      onSaveConfiguration?.()
      setShowSaveConfirmation(true)
      setTimeout(() => {
        setShowSaveConfirmation(false)
      }, 2000)
    }

    return (
      <PanelGroup
        title="Params"
        description={`Pick params for your iteration`}
        descriptionClassName={classes.description}
        headerComp={
          <div className={classes.randomContainer}>
            {onSaveConfiguration && (
              <IconButton
                className={classes.saveConfigButton}
                disabled={disableSaveConfigurationButton}
                title="save configuration"
                onClick={handleClickSaveConfiguration}
              >
                <FontAwesomeIcon icon={faFloppyDisk} />
                {showSaveConfirmation && (
                  <div className={classes.confirmSave}>
                    Param configuration saved{" "}
                    <i className="fa-solid fa-check fa-xs" />
                  </div>
                )}
              </IconButton>
            )}
            {onOpenLoadConfigurationModal && (
              <IconButton
                disabled={disableOpenLoadConfigurationButton}
                title="load configuration"
                onClick={onOpenLoadConfigurationModal}
              >
                <i className="fa-sharp fa-solid fa-inbox-out" />
              </IconButton>
            )}
            <IconButton
              title="Randomize"
              onClick={handleRandomizeParams}
              disabled={allLocked}
            >
              <i className="fa-sharp fa-solid fa-shuffle" aria-hidden />
            </IconButton>
            <IconButton
              title="Previous"
              onClick={onUndo}
              disabled={
                !!history &&
                typeof historyOffset !== "undefined" &&
                (history?.length === 0 ||
                  (historyOffset >= 0 && historyOffset === history?.length - 1))
              }
            >
              <FontAwesomeIcon icon={faRotateLeft} />
            </IconButton>
            <IconButton
              title="Next"
              onClick={onRedo}
              disabled={
                history && (history?.length === 0 || historyOffset === -1)
              }
            >
              <FontAwesomeIcon icon={faRotateRight} />
            </IconButton>
            {withParamLocking && (
              <div>
                <LockButton
                  title="toggle lock all params"
                  isLocked={allLocked}
                  onClick={handleToggleLockAllParams}
                  className={cx(classes.lockAllButton, {
                    [classes.primary]: allLocked,
                  })}
                />
              </div>
            )}
          </div>
        }
      >
        <div className={classes.controlsWrapper}>
          {params && data && (
            <Controls
              definition={params}
              data={data}
              onChangeData={onChangeData}
              lockedParamIds={lockedParamIds}
              onClickLockButton={
                withParamLocking ? handleClickLockButton : undefined
              }
            />
          )}
        </div>
        <div className={classes.submitRow}>
          <div className={classes.checkboxWrapper}>
            <label htmlFor="updateCheckbox">auto-refresh params</label>
            <BaseInput
              id="updateCheckbox"
              type="checkbox"
              checked={withAutoUpdate}
              onChange={() => onChangeWithAutoUpdate(!withAutoUpdate)}
            />
          </div>
          <BaseButton
            className={classes.submitButton}
            onClick={handleSubmitData}
          >
            refresh
          </BaseButton>
        </div>
      </PanelGroup>
    )
  }
)

PanelParams.displayName = "PanelParams"
