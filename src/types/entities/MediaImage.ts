export interface MediaImage {
  cid: string
  width?: number
  height?: number
  metadata?: {} | null
  mimeType?: string
  placeholder?: string
  processed: boolean
}
