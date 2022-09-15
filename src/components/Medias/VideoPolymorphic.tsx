import { useMemo, VideoHTMLAttributes } from "react"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import { isUriIpfs } from "../../utils/ipfs"

const extensions = ["ogg", "webm", "mp4"]

type THTMLVideoProps = VideoHTMLAttributes<HTMLVideoElement>

interface VideoPolymorphicProps extends THTMLVideoProps {
  uri: string
  type?: string
}
/**
 * The VideoPolymorphic component can be used to display a video and adapts
 * the URL which is fed to the <video> element based on the input source
 */
export function VideoPolymorphic({
  uri,
  type,
  ...videoProps
}: VideoPolymorphicProps) {
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
    return extensions.indexOf(extension) > -1 ? `video/${extension}` : undefined
  }, [type, url])
  if (!url) return <div>Video not found</div>

  return (
    <video {...videoProps}>
      <source src={url} type={sourceType} />
      Video format not supported ({url})
    </video>
  )
}
