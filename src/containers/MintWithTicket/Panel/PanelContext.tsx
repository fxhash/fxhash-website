import styles from "./PanelContext.module.scss"
import { PanelGroup } from "./PanelGroup"
import { Switch } from "components/Input/Switch"

export interface PanelContextProps {
  context: "minting" | "standalone"
  onChangeContext: (c: "minting" | "standalone") => void
}

export function PanelContext({ context, onChangeContext }: PanelContextProps) {
  return (
    <PanelGroup title="Context" description="Useful description...">
      <div>
        Minting
        <Switch
          className={styles.switch}
          onChange={(value) =>
            onChangeContext(value ? "standalone" : "minting")
          }
          value={context === "standalone"}
        />
        Standalone
      </div>
    </PanelGroup>
  )
}
