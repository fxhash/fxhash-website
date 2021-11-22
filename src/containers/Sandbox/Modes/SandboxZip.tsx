// import style from "./SandboxZip.module.scss"
import cs from "classnames"
import { FunctionComponent } from "react"
import { processZipSandbox } from "../../../utils/sandbox"
import { SandboxMode, SandboxModeProps, SandboxModule } from "./Generics"


interface Props extends SandboxModeProps {
}

/**
 * The SandboxZip component is used to display the contents of a ZIP file in the Sandbox <iframe>
 * It receives as input: 
 *  - zip file
 * It should implement:
 *  - onMintReadyState callback -> changes the state of the mint
 *  - have a ref to getProjectForMint() which returns the File to be minted
 */
export const SandboxZip: FunctionComponent<Props> = ({
  onReadyStateUpdate
}) => {
  return (
    <div>Sandbox ZIP</div>
  )
}

export const SandboxZipModule: SandboxModule = {
  mode: SandboxMode.EDITOR,
  component: SandboxZip
}