export enum ProfileUploadError {
  UNKNOWN =             "UNKNOWN",
  WRONG_FORMAT =        "WRONG_FORMAT",
  IPFS_UPLOAD_FAILED =  "IPFS_UPLOAD_FAILED",
}

export interface ProfileUploadResponse {
  metadataUri: string
}

export interface MintGenUploadProjectResponse {
  cidParams: string,
  authenticationHash: string
}

export enum StaticGenError {
  UNKNOWN               = "UNKNOWN",
  MISSING_PARAMETERS    = "MISSING_PARAMETERS",
  AUTH_FAILED           = "AUTH_FAILED", 
  INVALID_HASH          = "INVALID_HASH", 
  IPFS_UPLOAD_FAILED    = "IPFS_UPLOAD_FAILED",
  NO_SNIPPET            = "NO_SNIPPET", 
}

export interface StaticGenResponse {
  cidStatic: string
  authenticationHash: string
}

export enum CaptureErrorEnum {
  UNKNOWN               = "UNKNOWN",
  MISSING_PARAMETERS    = "MISSING_PARAMETERS",
  UNSUPPORTED_URL       = "UNSUPPORTED_URL",
  INVALID_RESOLUTION    = "INVALID_RESOLUTION",
  INVALID_DELAY         = "INVALID_DELAY"
}

export interface CaptureErrorResponse {
  error: CaptureErrorEnum
}

export interface CaptureResponse {
  capture: string
}

export enum PreviewError {
  UNKNOWN               = "UNKNOWN",
  MISSING_PARAMETERS    = "MISSING_PARAMETERS",
  AUTH_FAILED           = "AUTH_FAILED", 
  INCORRECT_PARAMETERS  = "INCORRECT_PARAMETERS", 
  PREVIEW_ERROR         = "PREVIEW_ERROR",
  IPFS_ERROR            = "IPFS_ERROR", 
}

export interface PreviewResponse {
  cidPreview: string
  cidThumbnail: string
  authenticationHash: string
  resX: number,
  resY: number,
  delay: number
}

export enum MetadataError {
  UNKNOWN               = "UNKNOWN",
  IPFS_ERROR            = "IPFS_ERROR",
}

export interface MetadataResponse {
  cid: string
}