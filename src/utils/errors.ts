import { string } from "yup/lib/locale"
import { FileUploadError } from "../types/errors"
import { CaptureErrorEnum, StaticGenError } from "../types/Responses"


const fileUploadErrors: Record<FileUploadError, string> = {
  UNKNOWN: "Unknown error. fxhash should get their shit together",
  NO_FILE: "No file was sent to the server",
  WRONG_FORMAT: "Format is invalid, only .zip files are accepted",
  NO_INDEX_HTML: "The zip file you uploaded does not have an index.html at its root",
  NO_SNIPPET: "The fxhash code snippet is missing from your index.html file, you can look at the guide to fix the issue",
  FAILED_UNZIP: "You file could not be unzipped"
}

export function getFileUploadError(error: FileUploadError) {
  return fileUploadErrors[error] || fileUploadErrors[FileUploadError.UNKNOWN]
}


const staticGenErrors: Record<StaticGenError, string> = {
  UNKNOWN: "Unknown error. fxhash should get their shit together",
  MISSING_PARAMETERS: "The request is missing some parameters",
  AUTH_FAILED: "Server could not authenticate your project. Please try again.", 
  INVALID_HASH: "The hash does not comply with the specs", 
  NO_SNIPPET: "The fxhash code snippet is missing from your index.html file, you can look at the guide to fix the issue",
  IPFS_UPLOAD_FAILED: "Could not download/upload to IPFS",
}

export function getStaticGenError(error: StaticGenError) {
  return staticGenErrors[error] || staticGenErrors[StaticGenError.UNKNOWN]
}

const captureErrors: Record<CaptureErrorEnum, string> = {
  UNKNOWN: "Unkown error. Please try again.",
  MISSING_PARAMETERS: "Parameters are missing from the request",
  UNSUPPORTED_URL: "The URL of your project is not supported by the capture module",
  INVALID_RESOLUTION: "Invalid resolution, lust be [256; 2048]",
  INVALID_DELAY: "Invalid delay, must be [0.1; 40] sec"
}

export function getCaptureError(error: CaptureErrorEnum) {
  return captureErrors[error] || captureErrors[StaticGenError.UNKNOWN]
}