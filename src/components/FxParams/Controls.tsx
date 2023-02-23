import { createRef, useEffect, useMemo, useState } from "react"
import { consolidateParams } from "components/FxParams/utils"
import { ParameterController } from "./Controller/Param"
import { LockButton } from "./LockButton/LockButton"
import classes from "./Controls.module.scss"
import { validateParameterDefinition } from "./validation"

interface ControllerBladeProps {
  parameter: any
  onClickLockButton?: (id: string) => void
  lockedParamIds?: string[]
  onChangeParam: (id: string, value: any) => void
}

function ControllerBlade(props: ControllerBladeProps) {
  const { parameter, onClickLockButton, lockedParamIds, onChangeParam } = props
  const parsed = useMemo(
    () => validateParameterDefinition(parameter),
    [parameter]
  )
  const isValid = useMemo(() => parsed && parsed.success, [parsed])
  return (
    <div className={classes.blade}>
      <ParameterController
        parameter={parameter}
        value={parameter.value}
        onChange={onChangeParam}
      />
      {onClickLockButton && isValid && (
        <LockButton
          className={classes.lockButton}
          title={`toggle lock ${parameter.id} param`}
          isLocked={lockedParamIds?.includes(parameter.id)}
          onClick={(e) => onClickLockButton(parameter.id)}
        />
      )}
    </div>
  )
}

interface ControlsProps {
  params: any
  onClickLockButton?: (id: string) => void
  lockedParamIds?: string[]
  onChangeData: (newData: Record<string, any>) => void
  data: Record<string, any>
}

export const Controls = ({
  params,
  data,
  onClickLockButton,
  lockedParamIds,
  onChangeData,
}: ControlsProps) => {
  const consolidatedParams = consolidateParams(params, data)

  const p: React.RefObject<HTMLDivElement> = createRef()

  useEffect(() => {
    const ps: any = {}
    if (consolidatedParams?.length > 0) {
      consolidatedParams.forEach((p: any) => {
        ps[p.id] = p.value
      })
      onChangeData(ps)
    }
  }, [params])

  const handleChangeParam = (id: string, value: any) => {
    const newData = { ...data, [id]: value }
    onChangeData(newData)
  }

  return (
    <div className={classes.controls} ref={p}>
      {consolidatedParams?.map((p: any) => {
        return (
          <ControllerBlade
            key={p.id}
            parameter={p}
            onChangeParam={handleChangeParam}
            lockedParamIds={lockedParamIds}
            onClickLockButton={onClickLockButton}
          />
        )
      })}
    </div>
  )
}
