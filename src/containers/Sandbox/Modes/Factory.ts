import { SandboxMode, SandboxModule } from "./Generics"
import { SandboxEditorModule } from "./SandboxEditor"
import { SandboxZipModule } from "./SandboxZip"

const SandboxModules: SandboxModule[] = [
  SandboxEditorModule, SandboxZipModule
]

export function SandboxModuleFactory(mode: SandboxMode): SandboxModule {
  return SandboxModules.find(mod => mod.mode === mode)!
}