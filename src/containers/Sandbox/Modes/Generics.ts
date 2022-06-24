/**
 * This file defines a list of Generic definitions the SandboxMode components should implement
 */

import { ReactNode, FunctionComponent } from "react"
import { RawTokenFeatures } from "../../../types/Metadata"
import { SandboxFiles } from "../../../types/Sandbox"

// the list of the different modes the Sandbox can take
export enum SandboxMode {
  // user provides a full zip file
  UPLOADED_ZIP    = "UPLOADED_ZIP",
  // user edits the files in the web browser, starting from a template
  EDITOR          = "EDITOR" 
}

// the list of states the ready state can be
export enum SandboxReadyState {
  // void state
  NONE          = "NONE",
  // user provided some input but it's invalid
  INVALID       = "INVALID",
  // user provided some input and it's valid, ready to be minted
  READY         = "READY"
}

export interface SandboxModeProps {
  // when the mint state needs to be updated, this method will be called
  onReadyStateUpdate: (state: SandboxReadyState) => void
  // when the files are changed (ie: the project), this method will be called
  onFilesUpdate: (files: SandboxFiles) => void
  // sandbox modules are responsible for handling hash update
  onHashUpdate: (hash: string) => void
  // the higher-order component will be responsible for gathering features, but this component is responsible for displaying those
  features: RawTokenFeatures | null
  // the data initially sent to the SandboxMode component
  initialData: any
  // this component will receive the SandBox, so that it can display wherever it needs
  children: ReactNode
}

export interface SandboxModeRef {
  // should return a ZIP file, ready to be minted on the blockchain
  getProjectForMint: () => File
}

// a SandboxModule defines an extension to the SandboxMode component, by providing external utilities to the consumers
export interface SandboxModule {
  // the mode to which the module is associated
  mode: SandboxMode
  component: FunctionComponent<SandboxModeProps>
}