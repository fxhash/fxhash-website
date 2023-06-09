import nl2br from "react-nl2br"
import style from "./PanelMintingInstructions.module.scss"
import { PanelGroup } from "./PanelGroup"

export interface PanelMintingInstructionsProps {
  instructions: string
}

export function PanelMintingInstructions({
  instructions,
}: PanelMintingInstructionsProps) {
  return (
    <PanelGroup
      title="Minting instructions"
      description="The artist's instructions for minting this piece."
      collapsible
    >
      <div className={style.instructions}>{nl2br(instructions)}</div>
    </PanelGroup>
  )
}
