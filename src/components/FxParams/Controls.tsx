import { createRef, useEffect, useMemo, useState } from "react"
import {
  consolidateParams,
  stringifyParamsData,
} from "components/FxParams/utils"
import { ParameterController } from "./Controller/Param"
import { LockButton } from "./LockButton/LockButton"
import classes from "./Controls.module.scss"
import { validateParameterDefinition } from "./validation"
import {
  FxParamDefinition,
  FxParamDefinitions,
  FxParamType,
  FxParamTypeMap,
  FxParamsData,
} from "./types"

interface ControllerBladeProps<Type extends FxParamType> {
  definition: FxParamDefinition<Type>
  value: FxParamTypeMap[Type]
  onClickLockButton?: (id: string) => void
  lockedParamIds?: string[]
  onChange: (value: FxParamTypeMap[Type]) => void
}

function ControllerBlade<Type extends FxParamType>(
  props: ControllerBladeProps<Type>
) {
  const { value, definition, onChange, onClickLockButton, lockedParamIds } =
    props
  const parsed = useMemo(
    () => validateParameterDefinition(definition),
    [definition]
  )
  const isValid = useMemo(() => parsed && parsed.success, [parsed])
  return (
    <div className={classes.blade}>
      <ParameterController
        definition={definition}
        value={value}
        onChange={onChange}
      />
      {onClickLockButton && isValid && (
        <LockButton
          className={classes.lockButton}
          title={`toggle lock ${definition.id} param`}
          isLocked={lockedParamIds?.includes(definition.id)}
          onClick={(e) => onClickLockButton(definition.id)}
        />
      )}
    </div>
  )
}

interface ControlsProps {
  definition: FxParamDefinitions
  onClickLockButton?: (id: string) => void
  lockedParamIds?: string[]
  onChangeData: (newData: FxParamsData) => void
  data: FxParamsData
}

export const Controls = ({
  definition,
  data,
  onClickLockButton,
  lockedParamIds,
  onChangeData,
}: ControlsProps) => {
  const p: React.RefObject<HTMLDivElement> = createRef()

  const handleChangeParam = (id: string, value: any) => {
    const newData = { ...data, [id]: value }
    onChangeData(newData)
  }

  return (
    <div className={classes.controls} ref={p}>
      {definition?.map((def) => {
        return (
          <ControllerBlade
            key={def.id}
            definition={def}
            value={data[def.id]}
            onChange={(value) => handleChangeParam(def.id, value)}
            lockedParamIds={lockedParamIds}
            onClickLockButton={onClickLockButton}
          />
        )
      })}
    </div>
  )
}
