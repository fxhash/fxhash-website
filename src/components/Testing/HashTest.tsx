import style from "./HashTest.module.scss"
import cs from "classnames"
import { InputText } from "../Input/InputText"
import { Button } from "../Button"
import { useEffect } from "react"
import { generateFxHash } from "../../utils/hash"


interface Props {
  onHashUpdate: (hash: string) => void
  onRetry: () => void
  value: string|null
  autoGenerate?: boolean
}

export function HashTest({
  onHashUpdate,
  onRetry,
  value,
  autoGenerate = true
}: Props) {
  // when it mounts, generates a hash and send it upwards
  useEffect(() => {
    if (autoGenerate) {
      onHashUpdate(generateFxHash())
    }
  }, [])

  const newHash = () => {
    onHashUpdate(generateFxHash())
  }

  return (
    <div className={cs(style.container)}>
      <small>Current hash</small>
      <InputText value={value || ""} readOnly />
      <div className={cs(style.buttons)}>
        <Button
          size="small"
          color="primary"
          onClick={newHash}
        >
          new hash
        </Button>
        <Button
          size="small"
          onClick={onRetry}
        >
          retry with same hash
        </Button>
      </div>
    </div>
  )
}