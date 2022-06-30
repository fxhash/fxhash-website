import { BaseEditor } from "slate"
import { HistoryEditor } from "slate-history"
import { ReactEditor } from "slate-react"
import { IEditorMediaFile } from "./Image"
import { ISplit } from "../entities/Split";

export interface FxEditorExtension {
  updateMediaUrl: (
    target: IEditorMediaFile,
    uri: string
  ) => void
}

export type FxEditor = BaseEditor & ReactEditor & HistoryEditor & FxEditorExtension

export interface NFTArticleForm {
  title: string
  thumbnailCaption: string
  abstract: string
  editions: string
  royalties: string
  royaltiesSplit: ISplit[]
}

export interface DraftNFTArticle {
  form: NFTArticleForm
  lastSavedAt: string // utc
}
