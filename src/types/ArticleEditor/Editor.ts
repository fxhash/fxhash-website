import { BaseEditor, Editor } from "slate"
import { HistoryEditor } from "slate-history"
import { ReactEditor } from "slate-react"
import { IEditorMediaFile } from "./Image"
import { ISplit } from "../entities/Split";

export interface FxEditorExtension {
  updateMediaUrl: (
    target: IEditorMediaFile,
    uri: string
  ) => void
  getUploadedMedias: () => IEditorMediaFile[]
}

export type FxEditor = BaseEditor & ReactEditor & HistoryEditor & FxEditorExtension
export type EnhanceEditorWith = (editor: FxEditor, ...args: any[]) => any

export interface NFTArticleForm {
  title: string
  thumbnailUri: string | null
  thumbnailCaption: string
  body: string,
  abstract: string
  editions: string
  royalties: string
  royaltiesSplit: ISplit[]
  tags: string[]
}

export interface DraftNFTArticle {
  form: NFTArticleForm
  lastSavedAt: string // utc
  // is the article already minted ? (edition)
  minted: boolean
}
