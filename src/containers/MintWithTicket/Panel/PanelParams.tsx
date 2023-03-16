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
import { faRotateLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons"
import cx from "classnames"
import { Controls } from "components/FxParams/Controls"
import { getRandomParamValues } from "components/FxParams/utils"
import { IParamsHistoryEntry } from "components/FxParams/ParamsHistory"
import {
  BaseInput,
  BaseButton,
  IconButton,
} from "components/FxParams/BaseInput"

interface Props {
  data?: FxParamsData
  params: FxParamDefinition<FxParamType>[]
  onChangeData: (d: FxParamsData) => void
  onClickLockButton?: (id: string) => void
  onChangeLockedParamIds?: (ids: string[]) => void
  lockedParamIds?: string[]
  history?: IParamsHistoryEntry[]
  historyOffset?: number
  onUndo?: () => void
  onRedo?: () => void
  withAutoUpdate?: boolean
  onChangeWithAutoUpdate: (state: boolean) => void
}

export interface PanelParamsRef {
  updateData: (data: FxParamsData) => void
  getLocalData: () => FxParamsData
}

export const PanelParams = forwardRef<PanelParamsRef, Props>(
  (
    {
      params,
      onChangeData,
      onChangeLockedParamIds,
      lockedParamIds,
      history,
      historyOffset,
      onUndo,
      onRedo,
      withAutoUpdate,
      onChangeWithAutoUpdate,
    },
    ref
  ) => {
    const [localData, setLocalData] = useState<FxParamsData>({})
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
        const allParamIds = params.map(
          (d: FxParamDefinition<FxParamType>) => d.id
        )
        onChangeLockedParamIds?.(allParamIds)
      }
    }

    const handleOnChangeDebounced = useCallback(debounce(onChangeData, 200), [
      onChangeData,
    ])

    const handleChangeData = (data: FxParamsData) => {
      setLocalData(data)
      withAutoUpdate && handleOnChangeDebounced?.(data)
    }
    const handleRandomizeParams = () => {
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
      handleChangeData({ ...localData, ...randomValues })
    }

    const handleSubmitData = () => {
      onChangeData(localData)
    }

    const handleClickLockButton = (paramId: string) => {
      if (lockedParamIds?.includes(paramId)) {
        onChangeLockedParamIds?.(lockedParamIds.filter((id) => id !== paramId))
      } else {
        onChangeLockedParamIds?.([...(lockedParamIds || []), paramId])
      }
    }

    useImperativeHandle(ref, () => ({
      updateData: setLocalData,
      getLocalData: () => localData,
    }))

    return (
      <PanelGroup
        title="Params"
        description={`Pick params for your iteration`}
        descriptionClassName={classes.description}
        headerComp={
          <div className={classes.randomContainer}>
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
          <Controls
            params={params}
            data={localData}
            onChangeData={handleChangeData}
            lockedParamIds={lockedParamIds}
            onClickLockButton={
              withParamLocking ? handleClickLockButton : undefined
            }
          />
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
