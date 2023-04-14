import style from "./MinterTest.module.scss"
import cs from "classnames"
import { InputText } from "../Input/InputText"
import { Button } from "../Button"
import { useEffect, useState, useRef } from "react"
import {
  generateFxHash,
  generateTzAddress,
  isHashValid,
  isTzAddressValid,
} from "../../utils/hash"
import { Field } from "../Form/Field"

interface Props {
  onMinterUpdate: (minter: string) => void
  onRetry: () => void
  value: string | null
  autoGenerate?: boolean
}

export function MinterTest({
  onMinterUpdate,
  onRetry,
  value,
  autoGenerate = true,
}: Props) {
  const [error, setError] = useState<string>()
  const inputRef = useRef<HTMLInputElement>(null)

  // when it mounts, generates a hash and send it upwards
  useEffect(() => {
    if (autoGenerate) {
      onMinterUpdate(generateTzAddress())
    }
  }, [autoGenerate, onMinterUpdate])

  const newMinter = () => {
    setError(undefined)
    onMinterUpdate(generateTzAddress())
  }

  const manualUpdate = (minter: string) => {
    if (isTzAddressValid(minter)) {
      setError(undefined)
      onMinterUpdate(minter)
    } else {
      setError("You can only paste a valid tezos address")
    }
  }

  return (
    <div className={cs(style.container)}>
      <Field error={error}>
        <small>Current minter</small>
        <InputText
          ref={inputRef}
          value={value || ""}
          onChange={(evt) => manualUpdate(evt.target.value)}
          onFocus={() => inputRef.current && inputRef.current.select()}
          onClick={() => inputRef.current && inputRef.current.select()}
        />
      </Field>
      <div className={cs(style.buttons)}>
        <Button size="small" color="primary" onClick={newMinter} type="button">
          new address
        </Button>
        <Button size="small" onClick={onRetry} type="button">
          retry with same address
        </Button>
      </div>
    </div>
  )
}
