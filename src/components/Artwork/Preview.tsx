import { ipfsDisplayUrl } from '../../services/Ipfs'
import { useLazyImage } from '../../utils/hookts'
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
  const loaded = useLazyImage(U)

  return (
    <div className={style.container}>
      {U && loaded && <img src={U} alt={alt} />}
    </div>
  )
}