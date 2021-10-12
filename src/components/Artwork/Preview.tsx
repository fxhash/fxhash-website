import { ipfsDisplayUrl } from '../../services/Ipfs'
import style from './Artwork.module.scss'

interface Props {
  ipfsUri?: string
  alt?: string
}

export function ArtworkPreview({
  ipfsUri,
  alt = "Generative Token preview"
}: Props) {
  return (
    <div className={style.container}>
      <img src={ipfsDisplayUrl(ipfsUri)} alt={alt} />
    </div>
  )
}