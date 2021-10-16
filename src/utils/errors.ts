import { FileUploadError } from "../types/errors"


const fileUploadErrors: Record<FileUploadError, string> = {
  UNKNOWN: "Unknown error. fxhash should get their shit together",
  NO_FILE: "No file was sent to the server",
  WRONG_FORMAT: "Format is invalid, only .zip files are accepted",
  NO_INDEX_HTML: "The zip file you uploaded does not have an index.html at its root",
  NO_SNIPPET: "The fxhash code snippet is missing from your index.html file, you can look at the guide to fix the issue",
  FAILED_UNZIP: "You file could not be unzipped"
}

export function getFileUploadError(error: FileUploadError) {
  return fileUploadErrors[error]
}