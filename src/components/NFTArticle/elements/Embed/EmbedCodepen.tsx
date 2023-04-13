import React, { memo, useMemo } from "react"
import style from "./Embed.module.scss"
import { EmbedElementProps } from "./EmbedMediaDisplay"
import { getCodepenFromUrl } from "../../../../utils/embed"
import { Error } from "../../../Error/Error"

const EmbedCodepen = memo<EmbedElementProps>(({ href }) => {
  const data = useMemo(() => {
    const codepen = getCodepenFromUrl(href)
    return codepen
      ? {
          src: `https://codepen.io/rcyou/embed/${codepen.id}?default-tab=result`,
          author: codepen.author,
        }
      : null
  }, [href])
  return (
    <div contentEditable={false} className="embed_media">
      {data ? (
        <iframe
          className={style.codepen}
          scrolling="no"
          height="300"
          title="Codepen"
          src={data.src}
          frameBorder="no"
          loading="lazy"
          allow="transparency; fullscreen"
        >
          See the{" "}
          <a contentEditable={false} href={href}>
            Pen
          </a>{" "}
          by{" "}
          <a contentEditable={false} href={`https://codepen.io/${data.author}`}>
            @{data.author}
          </a>
          on{" "}
          <a contentEditable={false} href="https://codepen.io">
            CodePen
          </a>
          .
        </iframe>
      ) : (
        <Error>CodePen can&apos;t be load.</Error>
      )}
    </div>
  )
})
EmbedCodepen.displayName = "EmbedCodepen"

export default EmbedCodepen
