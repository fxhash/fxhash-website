import style from "./HashTest.module.scss"
import cs from "classnames"
import { InputText } from "../Input/InputText"
import { Button } from "../Button"
import { useEffect, useState, useRef } from "react"
import { Field } from "../Form/Field"

interface Props {
  onIterationUpdate: (iteration: number) => void
  onRetry: () => void
  value: number | null
  autoGenerate?: boolean
}

const generateFxIteration = () => Math.floor(Math.random() * 256)
const isIterationValid = (iteration: number) =>
  iteration >= 0 && iteration <= 255

export function IterationTest({
  onIterationUpdate,
  onRetry,
  value,
  autoGenerate = true,
}: Props) {
  const [error, setError] = useState<string>()
  const iterationInputRef = useRef<HTMLInputElement>(null)

  // when it mounts, generates a iteration and send it upwards
  useEffect(() => {
    if (autoGenerate) {
      onIterationUpdate(generateFxIteration())
    }
  }, [autoGenerate, onIterationUpdate])

  const newIteration = () => {
    setError(undefined)
    onIterationUpdate(generateFxIteration())
  }

  const manualIterationUpdate = (iteration: number) => {
    if (isIterationValid(iteration)) {
      setError(undefined)
      onIterationUpdate(iteration)
    } else {
      setError("You can only paste a valid iteration")
    }
  }

  return (
    <div className={cs(style.container)}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Field error={error}>
          <small>Current iteration</small>
          <InputText
            ref={iterationInputRef}
            value={value || 0}
            onChange={(evt) =>
              manualIterationUpdate(parseInt(evt.target.value))
            }
            onFocus={() =>
              iterationInputRef.current && iterationInputRef.current.select()
            }
            onClick={() =>
              iterationInputRef.current && iterationInputRef.current.select()
            }
          />
        </Field>
      </div>
      <div className={cs(style.buttons)}>
        <Button
          size="small"
          color="primary"
          onClick={newIteration}
          type="button"
        >
          new iteration
        </Button>
        <Button size="small" onClick={onRetry} type="button">
          retry with same iteration
        </Button>
      </div>
    </div>
  )
}
