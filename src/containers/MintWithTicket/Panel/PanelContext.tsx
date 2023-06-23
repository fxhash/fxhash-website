import styles from "./PanelContext.module.scss"
import { PanelGroup } from "./PanelGroup"
import { Switch } from "components/Input/Switch"

export enum FxContext {
  MINTING = "minting",
  STANDALONE = "standalone",
}

export interface PanelContextProps {
  context: FxContext
  onChangeContext: (c: FxContext) => void
}

export function PanelContext({ context, onChangeContext }: PanelContextProps) {
  return (
    <PanelGroup
      title="Context"
      description={`Toggle the execution context of the artwork between "minting" and "standalone"`}
    >
      <div>
        Minting
        <Switch
          className={styles.switch}
          onChange={(value) =>
            onChangeContext(value ? FxContext.STANDALONE : FxContext.MINTING)
          }
          value={context === FxContext.STANDALONE}
        />
        Standalone
      </div>
    </PanelGroup>
  )
}
