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
  forceEnabled?: boolean
}

export interface ControlsTestRef {
  setData: (data: FxParamsData) => void
}

export const ControlsTest = forwardRef<ControlsTestRef, ControlsTestProps>(
  (props, ref) => {
    const { params, definition, updateParams, onSubmit, forceEnabled } = props

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

    const allParamsCodeDriven = definition?.every(
      (d) => d.update === "code-driven"
    )

    return (
      <div className={classes.container}>
        {definition && params && (
          <Controls
            definition={definition}
            onChangeData={updateParams}
            data={params}
            forceEnabled={forceEnabled}
          />
        )}
        {allParamsCodeDriven && (
          <p className={classes.codeDrivenNote}>
            <i className="fa-solid fa-triangle-exclamation" aria-hidden />
            <span>
              All params of this artwork are defined as "code-driven". This will
              enable a dedicated minting experience for collectors. In this view
              "code-driven" controllers are just enabled for debugging purposes.
            </span>
          </p>
        )}
        {!allParamsCodeDriven && (
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
        )}
      </div>
    )
  }
)

ControlsTest.displayName = "ControlsTest"
