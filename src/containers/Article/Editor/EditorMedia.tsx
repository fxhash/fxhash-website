import style from "./EditorMedias.module.scss"
import text from "../../../styles/Text.module.css"
import cs from "classnames"
import { IEditorMediaFile } from "../../../types/ArticleEditor/Image"
import { ImagePolymorphic } from "../../../components/Medias/ImagePolymorphic"
import { Button } from "../../../components/Button"
import { forwardRef, useCallback, useImperativeHandle, useMemo } from "react"
import { isUrlLocal } from "../../../utils/files"
import useFetch, { CachePolicies } from "use-http"
import { API_FILE__ARTICLE_UPLOAD_FILE } from "../../../services/apis/file-api.service"
import { VideoPolymorphic } from "../../../components/Medias/VideoPolymorphic";

const UPLOAD_DEFAULT_ERROR = "Unknown error."

export interface Ref {
  uploadIpfs: () => void
}
interface Props {
  media: IEditorMediaFile
  onChangeUri: (uri: string) => void
}
export const EditorMedia = forwardRef<Ref, Props>(({
  media,
  onChangeUri,
}, ref) => {
  const isLocal = useMemo(
    () => isUrlLocal(media.uri),
    [media.uri]
  )

  const { post, loading, error, data } =
    useFetch<any>(API_FILE__ARTICLE_UPLOAD_FILE, {
      cachePolicy: CachePolicies.NO_CACHE,
      onNewData: (curr, data) => {
        if (data.cid) {
          // pull the uri update up
          onChangeUri(`ipfs://${data.cid}`)
        }
      }
    })

  const uploadFile = useCallback(async () => {
    if (isLocal && !loading) {
      const file = await (await fetch(media.uri)).blob()
      const form = new FormData()
      form.set("file", file)
      post(form)
    }
  }, [isLocal, loading, media, post])

  const errorMessage = error && (data.error || UPLOAD_DEFAULT_ERROR)

  // map the ref
  useImperativeHandle(ref, () => ({
    uploadIpfs: uploadFile
  }), [uploadFile])

  return (
    <div
      key={media.uri}
      className={cs(style.entry)}
    >
      <div className={cs(style.image__wrapper)}>
        {media.type === "image" &&
          <ImagePolymorphic
            uri={media.uri}
            className={cs(style.media)}
          />
        }
        {media.type === "video" &&
          <VideoPolymorphic
            uri={media.uri}
            className={cs(style.media)}
          />
        }
      </div>
      <span className={cs(style.uri)}>
        {errorMessage ? (
          <span
            className={cs(text.error)}
          >
            Upload error: {errorMessage}
          </span>
        ):isLocal ? (
          <span className={cs(text.info)}>
            Not uploaded yet
          </span>
        ):(
          <strong>
            {media.uri}
          </strong>
        )}
      </span>
      {!isLocal ? (
        <i
          className={cs("fa-solid fa-circle-check", text.success, text.h4)}
          aria-hidden
        />
      ):(
        <Button
          type="button"
          color="secondary"
          size="very-small"
          onClick={uploadFile}
          state={loading ? "loading" : "default"}
        >
          upload
        </Button>
      )}
    </div>
  )
})

EditorMedia.displayName = "EditorMedia"
