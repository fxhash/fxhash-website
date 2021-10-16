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