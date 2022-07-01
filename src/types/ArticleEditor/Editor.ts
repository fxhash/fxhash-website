import { BaseEditor } from "slate"
import { HistoryEditor } from "slate-history"
import { ReactEditor } from "slate-react"
import { IEditorMediaFile } from "./Image"

export interface FxEditorExtension {
  updateMediaUrl: (
    target: IEditorMediaFile,
    uri: string
  ) => void
}

export type FxEditor = BaseEditor & ReactEditor & HistoryEditor & FxEditorExtension