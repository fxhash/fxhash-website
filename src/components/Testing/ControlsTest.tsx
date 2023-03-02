import { useState, useImperativeHandle, forwardRef } from "react"
import { Button } from "components/Button"
import { Controls } from "components/FxParams/Controls"
import { getRandomParamValues } from "components/FxParams/utils"
import classes from "./ControlsTest.module.scss"
interface ControlsTestProps {
  params: any
  onSubmit: (data: Record<string, any>) => void
}

export interface ControlsTestRef {
  setData: (data: Record<string, any>) => void
}

export const ControlsTest = forwardRef<ControlsTestRef, ControlsTestProps>(
  (props, ref) => {
    const { params, onSubmit } = props
    const [data, setData] = useState<Record<string, any>>({})
    const handleSubmitParams = () => {
      onSubmit(data)
    }
    const handleRandomizeParams = () => {
      const randomValues = getRandomParamValues(params)
      setData({ ...data, ...randomValues })
    }

    useImperativeHandle(ref, () => ({
      setData,
    }))

    return (
      <div className={classes.container}>
        <Controls params={params} onChangeData={setData} data={data} />
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
