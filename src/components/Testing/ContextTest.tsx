import styles from "./ContextTest.module.scss"
import { TExecutionContext } from "hooks/useRuntime"
import { Select } from "components/Input/Select"
import { Button } from "components/Button"

interface Props {
  value: TExecutionContext | null | undefined
  onChange: (value: TExecutionContext) => void
  asButtons?: boolean
}

const contexts: TExecutionContext[] = ["minting", "standalone", "capture"]

export function ContextTest(props: Props) {
  const { onChange, value, asButtons = false } = props

  const handleChange = (context: TExecutionContext) => {
    onChange(context)
  }

  return (
    <div className={styles.contexttest}>
      <small>Context</small>
      {asButtons ? (
        <div className={styles.buttons}>
          {contexts.map((context) => (
            <Button
              className={styles.button}
              size="small"
              key={context}
              onClick={() => handleChange(context)}
              color={value === context ? "primary" : "black"}
            >
              {context}
            </Button>
          ))}
        </div>
      ) : (
        <Select
          className={styles.select}
          value={value}
          onChange={handleChange}
          options={contexts.map((c) => ({
            value: c,
            label: c,
          }))}
        />
      )}
    </div>
  )
}
