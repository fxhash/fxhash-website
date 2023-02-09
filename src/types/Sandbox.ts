export type SandboxFiles = Record<string, { blob?: Blob; url: string }>

export enum SandboxFileError {
  UNKNOWN = "UNKNOWN",
  WRONG_FORMAT = "WRONG_FORMAT",
  NO_INDEX_HTML = "NO_INDEX_HTML",
  NO_SNIPPET = "NO_SNIPPET",
  FAILED_UNZIP = "FAILED_UNZIP",
}
