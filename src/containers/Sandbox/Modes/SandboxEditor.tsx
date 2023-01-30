// import style from "./SandboxEditor.module.scss"
import cs from "classnames"
import { FunctionComponent } from "react"
import { SandboxMode, SandboxModeProps, SandboxModule } from "./Generics"

interface Props extends SandboxModeProps {}

export const SandboxEditor: FunctionComponent<Props> = () => {
  return <div>sandbox editor</div>
}

export const SandboxEditorModule: SandboxModule = {
  mode: SandboxMode.EDITOR,
  component: SandboxEditor,
}
