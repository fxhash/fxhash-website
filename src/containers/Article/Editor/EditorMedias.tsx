import style from "./EditorMedias.module.scss"
import text from "../../../styles/Text.module.css"
import cs from "classnames"
import { IEditorMediaFile } from "../../../types/ArticleEditor/Image"
import { EditorMedia, Ref as EditorMediaRef } from "./EditorMedia"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { isUrlLocal } from "../../../utils/files"
import { Button } from "../../../components/Button"

interface Props {
  medias: IEditorMediaFile[]
  onMediaUriUpdate: (media: IEditorMediaFile, uri: string) => void
}
export function EditorMedias({ medias, onMediaUriUpdate }: Props) {
  const mediasRef = useRef<EditorMediaRef[]>([])
  useEffect(() => {
    mediasRef.current = mediasRef.current.slice(0, medias.length)
  }, [medias])

  const hasLocalMedias = useMemo(() => {
    for (const media of medias) {
      if (isUrlLocal(media.uri)) {
        return true
      }
    }
    return false
  }, [medias])

  const uploadAllMedias = useCallback(() => {
    for (const ref of mediasRef.current) {
      ref.uploadIpfs()
    }
  }, [])

  return (
    <div className={cs(style.root)}>
      <div className={cs(style.medias)}>
        {medias.length === 0 && (
          <div className={cs(text.info, style.empty)}>
            No medias in the article
          </div>
        )}
        {medias.map((media, idx) => (
          <EditorMedia
            key={media.uri}
            ref={(ref) => (mediasRef.current[idx] = ref!)}
            media={media}
            onChangeUri={(uri) => onMediaUriUpdate(media, uri)}
          />
        ))}
      </div>
      {hasLocalMedias && (
        <Button
          type="button"
          color="secondary"
          size="small"
          onClick={uploadAllMedias}
        >
          upload all
        </Button>
      )}
    </div>
  )
}
