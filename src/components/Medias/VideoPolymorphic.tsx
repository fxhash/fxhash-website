import text from "../../styles/Text.module.css";
import { useCallback, useMemo, useState, VideoHTMLAttributes } from "react"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import { isUriIpfs } from "../../utils/ipfs"

const extensions = ['ogg', 'webm', 'mp4'];

type THTMLVideoProps = VideoHTMLAttributes<HTMLVideoElement>

interface VideoPolymorphicProps extends THTMLVideoProps {
  uri: string
  type?: string
  showLoadingError?: boolean,
}
/**
 * The VideoPolymorphic component can be used to display a video and adapts
 * the URL which is fed to the <video> element based on the input source
 */
export function VideoPolymorphic({ uri, type, showLoadingError, ...videoProps }: VideoPolymorphicProps) {
  const [hasLoadingError, setHasLoadingError] = useState(false);
  const handleError = useCallback((e) => {
    setHasLoadingError(true);
    if (videoProps.onError) {
      videoProps.onError(e);
    }
  }, [videoProps])
  const handleOnCanPlay = useCallback((e) => {
    setHasLoadingError(false);
    if (videoProps.onCanPlay) {
      videoProps.onCanPlay(e);
    }
  }, [videoProps])
  const url = useMemo(
    () => uri && isUriIpfs(uri)
      ? ipfsGatewayUrl(uri)
      : uri,
    [uri]
  )
  const sourceType = useMemo(() => {
    if (type) return type;
    if (!url) return undefined;
    try {
      const urlObj = new URL(url);
      const splittedUrl = urlObj.pathname.split('.');
      const extension = splittedUrl[splittedUrl.length - 1];
      return extensions.indexOf(extension) > -1 ?
        `video/${extension}`
        : undefined;
    } catch (e) {
      return undefined;
    }
  }, [type, url])
  if (!url) return <div>Video not found</div>

  return (
    <>
      <video {...videoProps} onError={handleError} onCanPlay={handleOnCanPlay}>
        <source src={url} type={sourceType} />
        Video format not supported ({url})
      </video>
      {showLoadingError && hasLoadingError && <div className={text.error}>Sorry, the video could not be loaded.</div>}
    </>
  )
}
