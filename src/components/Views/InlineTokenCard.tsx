import style from "./InlineTokenCard.module.scss"
import cs from "classnames"
import colors from "styles/Colors.module.css"
import { ArtworkPreview } from "components/Artwork/Preview"
import { MediaImage } from "types/entities/MediaImage"
import { PropsWithChildren, ReactNode } from "react"
import { Spacing } from "components/Layout/Spacing"
import { User } from "types/entities/User"
import { EntityBadge } from "components/User/EntityBadge"

type Props = PropsWithChildren<{
  image?: MediaImage
  ipfsUri?: string
  identifier?: string
  title: string
  author?: User
}>
export function InlineTokenCard({
  image,
  ipfsUri,
  identifier,
  title,
  author,
  children,
}: Props) {
  return (
    <div className={cs(style.root)}>
      <div className={cs(style.preview_wrapper)}>
        <ArtworkPreview image={image} ipfsUri={ipfsUri} />
      </div>
      <div className={cs(style.details)}>
        {identifier && <small className={cs(colors.gray)}>{identifier}</small>}
        <h3>{title}</h3>
        {author && (
          <>
            <Spacing size="3x-small" sm="x-small" />
            <EntityBadge user={author} size="regular" toggeable />
          </>
        )}
        {children && (
          <>
            <Spacing size="small" />
            <div className={cs(style.artwork_details)}>{children}</div>
          </>
        )}
      </div>
    </div>
  )
}
