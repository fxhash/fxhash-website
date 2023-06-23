import styles from "./ContextTest.module.scss"
import { TExecutionContext } from "hooks/useRuntime"
import { Select } from "components/Input/Select"

interface Props {
  value: TExecutionContext | null | undefined
  onChange: (value: TExecutionContext) => void
}

const contexts = ["minting", "standalone", "capture"]

export function ContextTest(props: Props) {
  const { onChange, value } = props

  const handleChange = (context: TExecutionContext) => {
    onChange(context)
  }

  return (
    <div className={styles.contexttest}>
      <small>Context</small>
      <Select
        className={styles.select}
        value={value}
        onChange={handleChange}
        options={contexts.map((c) => ({
          value: c,
          label: c,
        }))}
      />
    </div>
  )
}
