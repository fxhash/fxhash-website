import { AudioHTMLAttributes, useMemo } from "react"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import { isUriIpfs } from "../../utils/ipfs"

const extensions = ["ogg", "mp3", "mpeg", "wav", "flac"]

type THTMLAudioProps = AudioHTMLAttributes<HTMLAudioElement>

interface AudioPolymorphicProps extends THTMLAudioProps {
  uri: string
  type?: string
}
/**
 * The AudioPolymorphic component can be used to display a video and adapts
 * the URL which is fed to the <audio> element based on the input source
 */
export function AudioPolymorphic({
  uri,
  type,
  ...videoProps
}: AudioPolymorphicProps) {
  // if the URL is an IPFS one, target the gateway otherwise just use uri
  const url = useMemo(
    () => (uri && isUriIpfs(uri) ? ipfsGatewayUrl(uri) : uri),
    [uri]
  )
  const sourceType = useMemo(() => {
    if (type) return type
    if (!url) return undefined
    const urlObj = new URL(url)
    const splittedUrl = urlObj.pathname.split(".")
    const extension = splittedUrl[splittedUrl.length - 1]
    return extensions.indexOf(extension) > -1 ? `audio/${extension}` : undefined
  }, [type, url])
  if (!url) return <div>Video not found</div>

  return (
    <audio {...videoProps}>
      <source src={url} type={sourceType} />
      Audio format not supported ({url})
    </audio>
  )
}
