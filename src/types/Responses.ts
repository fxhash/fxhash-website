import { TokenFeature } from "./Metadata";
import { CaptureMode, CaptureTriggerMode } from "./Mint";

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

//
// Responses related to generating Previews in the case of calling the 
// /preview endpoint of the file-api
//

export enum PreviewError {
  UNKNOWN               = "UNKNOWN",
  MISSING_PARAMETERS    = "MISSING_PARAMETERS",
  AUTH_FAILED           = "AUTH_FAILED", 
  INCORRECT_PARAMETERS  = "INCORRECT_PARAMETERS", 
  PREVIEW_ERROR         = "PREVIEW_ERROR",
  IPFS_ERROR            = "IPFS_ERROR", 
}

export interface PreviewErrorResponse {
  error: PreviewError
}

export interface PreviewResponse {
  cidPreview: string
  cidThumbnail: string
  authenticationHash: string
  mode: CaptureMode
  triggerMode: CaptureTriggerMode
  resX: number
  resY: number
  delay: number
  canvasSelector: string
  gpu: boolean
}


//
// Responses related to generating Previews in the case of Testing
//

export enum TestPreviewError {
  UNKNOWN                       = "UNKNOWN",
  TIMEOUT                       = "TIMEOUT",
  EXTRACT_SERVICE_UNREACHABLE   = "EXTRACT_SERVICE_UNREACHABLE",
  INVALID_INPUT_PARAMETERS      = "INVALID_INPUT_PARAMETERS",
  JOB_QUEUE_FAILED              = "JOB_QUEUE_FAILED",
  JOB_EXECUTION_FAILED          = "JOB_EXECUTION_FAILED",
}

export interface TestPreviewResponse {
  capture: string
  features?: string
}

export interface TestPreviewErrorResponse {
  error: TestPreviewError
}

export enum MetadataError {
  UNKNOWN               = "UNKNOWN",
  IPFS_ERROR            = "IPFS_ERROR",
}

export interface MetadataResponse {
  cid: string
}

export enum MintError {
  UNKNOWN               = "UNKNOWN",
  BAD_REQUEST           = "BAD_REQUEST",
  TOKEN_NOT_EXISTS      = "TOKEN_NOT_EXISTS",
  TOKEN_UNAVAILABLE     = "TOKEN_UNAVAILABLE",
  FAIL_GET_METADATA     = "FAIL_GET_METADATA",
  WRONG_TOKEN_METADATA  = "WRONG_TOKEN_METADATA",
  FAIL_AUTHENTICATE     = "FAIL_AUTHENTICATE",
  FAIL_GET_TOKEN        = "FAIL_GET_TOKEN",
  INVALID_TOKEN         = "INVALID_TOKEN",
  FAIL_ADD_IPFS         = "FAIL_ADD_IPFS",
  FAIL_PREVIEW          = "FAIL_PREVIEW",
}

export const MintErrors: MintError[] = Object.values(MintError)

export enum MintProgressMessage {
  // call API to get token data (fail: TOKEN_NOT_EXISTS)
  GET_TOKEN_DATA = "GET_TOKEN_DATA",
  // get the metadata from IPFS (fail: FAIL_GET_METADATA)
  GET_TOKEN_METADATA = "GET_TOKEN_METADATA", 
  // get URL params files on IPFS (fail: FAIL_GET_TOKEN)
  GET_GENERATIVE_TOKEN_CONTENTS = "GET_GENERATIVE_TOKEN_CONTENTS",
  // upload project to ipfs (fail: FAIL_ADD_IPFS)
  ADD_CONTENT_IPFS = "ADD_CONTENT_IPFS", 
  // generate preview (fail: FAIL_PREVIEW)
  GENERATE_PREVIEW = "GENERATE_PREVIEW", 
  // authenticate token
  AUTHENTICATE_TOKEN = "AUTHENTICATE_TOKEN", 
}

export interface MintResponse {
  cidMetadata: string
  cidGenerative: string
  cidPreview: string
}

export enum SigningState {
  NONE =                  "NONE",
  NOT_FOUND =             "NOT_FOUND",
  QUEUED =                "QUEUED",
  GENERATING_METADATA =   "GENERATING_METADATA",
  METADATA_GENERATED =    "METADATA_GENERATED",
  CALLING_CONTRACT =      "CALLING_CONTRACT",
  SIGNED =                "SIGNED",
}

export interface SigningProgress {
  state: SigningState,
  extra?: any
}

export interface SigningData {
  cidGenerative?: string
  cidPreview?: string
  features?: TokenFeature[]
}