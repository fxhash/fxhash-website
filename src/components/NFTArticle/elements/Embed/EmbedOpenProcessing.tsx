import React, { memo, useMemo } from "react"
import style from "./Embed.module.scss"
import { EmbedElementProps } from "./EmbedMediaDisplay"
import { getOpenProcessingIdFromUrl } from "../../../../utils/embed"
import cs from "classnames"

const EmbedOpenProcessing = memo<EmbedElementProps>(({ href }) => {
  const src = useMemo(() => {
    const id = getOpenProcessingIdFromUrl(href)
    return `https://openprocessing.org/sketch/${id}/embed`
  }, [href])
  return (
    <div
      className={cs(style.open_processing, "embed_media")}
      contentEditable={false}
    >
      <iframe src={src} />
    </div>
  )
})
EmbedOpenProcessing.displayName = "EmbedProcessing"

export default EmbedOpenProcessing
