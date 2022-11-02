export type IEditorMediaType = "image" | "video" | "audio"

export interface IEditorMediaFile {
  uri: string
  type: IEditorMediaType
}
