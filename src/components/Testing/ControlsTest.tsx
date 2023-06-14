import { useState, useImperativeHandle, forwardRef, useEffect } from "react"
import { Button } from "components/Button"
import { Controls } from "components/FxParams/Controls"
import {
  buildParamsObject,
  consolidateParams,
  getRandomParamValues,
  jsonStringifyBigint,
} from "components/FxParams/utils"
import classes from "./ControlsTest.module.scss"
import { FxParamDefinitions, FxParamsData } from "components/FxParams/types"

interface ControlsTestProps {
  definition: FxParamDefinitions | null
  params: FxParamsData | null
  updateParams: (params: Partial<FxParamsData>) => void
  onSubmit: (data: FxParamsData) => void
}

export interface ControlsTestRef {
  setData: (data: FxParamsData) => void
}

export const ControlsTest = forwardRef<ControlsTestRef, ControlsTestProps>(
  (props, ref) => {
    const { params, definition, updateParams, onSubmit } = props

    const handleSubmitParams = () => {
      params && onSubmit(params)
    }

    const handleRandomizeParams = () => {
      if (definition) {
        const randomValues = getRandomParamValues(definition)
        updateParams(randomValues)
      }
    }

    useImperativeHandle(ref, () => ({
      setData: updateParams,
    }))

    return (
      <div className={classes.container}>
        {definition && params && (
          <Controls
            definition={definition}
            onChangeData={updateParams}
            data={params}
          />
        )}
        <div className={classes.buttons}>
          <Button
            size="small"
            color="primary"
            type="button"
            onClick={handleRandomizeParams}
          >
            randomize params
          </Button>
          <Button size="small" type="button" onClick={handleSubmitParams}>
            submit params
          </Button>
        </div>
      </div>
    )
  }
)

ControlsTest.displayName = "ControlsTest"
