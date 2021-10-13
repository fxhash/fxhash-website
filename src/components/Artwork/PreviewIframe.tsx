import style from './Artwork.module.scss'

interface Props {
  url?: string
}

export function ArtworkIframe({
  url,
}: Props) {
  return (
    <div className={style.container}>
      <p>{url}</p>
    </div>
  )
}