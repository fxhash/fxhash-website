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
  onSoftSubmit: (data: FxParamsData) => void
}

export interface ControlsTestRef {
  setData: (data: FxParamsData) => void
}

export const ControlsTest = forwardRef<ControlsTestRef, ControlsTestProps>(
  (props, ref) => {
    const { params, definition, onSubmit, onSoftSubmit } = props
    const [data, setData] = useState<FxParamsData | null>(null)

    // whenever definition changes, enforce the reset of the params data object
    useEffect(() => {
      setData(definition ? buildParamsObject(definition, params) : {})
    }, [jsonStringifyBigint(definition), jsonStringifyBigint(params)])

    // update the params in the state, eventually soft submit if sync mode is
    // enabled for any
    const update = (nd: FxParamsData) => {
      setData(nd)
      // ids diff
      const diffs = Object.keys(nd).filter((id) => data?.[id] !== nd[id])
      const syncs = diffs
        .map((id) => definition?.find((d) => d.id === id)!)
        .filter((def) => def.update === "sync")
      onSoftSubmit(Object.fromEntries(syncs.map((def) => [def.id, nd[def.id]])))
    }

    const handleSubmitParams = () => {
      data && onSubmit(data)
    }

    const handleRandomizeParams = () => {
      if (definition) {
        const randomValues = getRandomParamValues(definition)
        update({ ...data, ...randomValues })
      }
    }

    useImperativeHandle(ref, () => ({
      setData: update,
    }))

    return (
      <div className={classes.container}>
        {definition && data && (
          <Controls definition={definition} onChangeData={update} data={data} />
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
