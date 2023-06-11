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
  params: FxParamsData | null
  definition: FxParamDefinitions | null
  onSubmit: (data: FxParamsData) => void
}

export interface ControlsTestRef {
  setData: (data: FxParamsData) => void
}

export const ControlsTest = forwardRef<ControlsTestRef, ControlsTestProps>(
  (props, ref) => {
    const { params, definition, onSubmit } = props
    const [data, setData] = useState<FxParamsData | null>(null)

    // whenever definition changes, enforce the reset of the params data object
    useEffect(() => {
      setData(definition ? buildParamsObject(definition, params) : {})
    }, [jsonStringifyBigint(definition), jsonStringifyBigint(params)])

    const handleSubmitParams = () => {
      data && onSubmit(data)
    }
    const handleRandomizeParams = () => {
      if (definition) {
        const randomValues = getRandomParamValues(definition)
        setData({ ...data, ...randomValues })
      }
    }

    useImperativeHandle(ref, () => ({
      setData,
    }))

    return (
      <div className={classes.container}>
        {definition && data && (
          <Controls
            definition={definition}
            onChangeData={setData}
            data={data}
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
