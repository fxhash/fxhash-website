import { ArtworkIframeRef } from "components/Artwork/PreviewIframe"
import { IRuntimeContext } from "./useRuntime"

/**
 * The Runtime Plugger is used to synchronize a runtime state (exposed by the
 * useRuntime hook for instance) with a project context, as an iframe.
 */
export function useRuntimePlugger(
  runtime: IRuntimeContext,
  frame: ArtworkIframeRef
) {}
