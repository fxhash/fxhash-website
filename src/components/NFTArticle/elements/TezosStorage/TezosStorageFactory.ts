/**
 * This module handles the instanciation abstraction of the Tezos Storage blocks
 * based on the Tezos Storage Pointer properties.
 */

import { FunctionComponent } from "react"
import { ITezosStoragePointer } from "../../../../types/TezosStorage"
import { TezosStorageGentk } from "./TezosStorageGentk"
import { TezosStorageProject } from "./TezosStorageProject"
import { TezosStorageUnknown } from "./TezosStorageUnknown"

export interface TezosStorageRenderer<T> extends FunctionComponent<T> {
  // check if the renderer is compatible with the pointer
  matches: (pointer: ITezosStoragePointer) => boolean
  // get the props from the pointer
  getPropsFromPointer: (pointer: ITezosStoragePointer) => T
}

// the list of tezos storage render components
const TezosStorageRenderers: TezosStorageRenderer<any>[] = [
  TezosStorageProject,
  TezosStorageGentk,
  TezosStorageUnknown,
]

/**
 * Given some pointer to a storage, outputs the component which can render it
 * withotu failing due to unsupported data
 */
export function TezosStorageFactory(
  pointer: ITezosStoragePointer
): TezosStorageRenderer<any> {
  for (const renderer of TezosStorageRenderers) {
    if (renderer.matches(pointer)) {
      return renderer
    }
  }
  return TezosStorageUnknown
}