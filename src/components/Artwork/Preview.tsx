import { ipfsDisplayUrl } from '../../services/Ipfs'
import style from './Artwork.module.scss'

interface Props {
  ipfsUri?: string
  url?: string
  alt?: string
}

export function ArtworkPreview({
  ipfsUri,
  url,
  alt = "Generative Token preview"
}: Props) {
  const U = url || (ipfsUri && ipfsDisplayUrl(ipfsUri)) || null
  return (
    <div className={style.container}>
      {U && <img src={U} alt={alt} loading="lazy" />}
    </div>
  )
}