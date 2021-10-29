import { CaptureMode, CaptureSettings } from "../types/Mint";

export function validateCaptureSettings(settings: CaptureSettings): boolean {
  if (!settings.mode) return false
  if (settings.mode === CaptureMode.CANVAS) {
    return !!settings.canvasSelector
  }
  else if (settings.mode === CaptureMode.CUSTOM) {
    return true
  }
  else if (settings.mode === CaptureMode.VIEWPORT) {
    return !!settings.resX && !!settings.resY
  }
  return false
}