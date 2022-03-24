import style from "./GenerativeArtwork.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { SquareContainer } from "../Layout/SquareContainer"
import { ArtworkFrame } from "../Artwork/ArtworkFrame"
import { ArtworkIframe, ArtworkIframeRef } from "../Artwork/PreviewIframe"
import { Spacing } from "../Layout/Spacing"
import { ButtonVariations } from "../Button/ButtonVariations"
import { Button } from "../Button"
import Link from "next/link"
import { useContext, useMemo, useRef, useState } from "react"
import { SettingsContext } from "../../context/Theme"
import { ipfsGatewayUrl } from "../../services/Ipfs"

interface Props {
  token: GenerativeToken
  forceImageDisplay?: boolean
}
export function GenerativeArtwork({
  token,
  forceImageDisplay = false,
}: Props) {
  const settings = useContext(SettingsContext)
  const iframeRef = useRef<ArtworkIframeRef>(null)

  // used to preview the token in the iframe with different hashes
  const [previewHash, setPreviewHash] = useState<string|null>(
    token.metadata.previewHash || null
  )
  // are we exploring variations ? use to force quality = 1
  const [exploreVariations, setExploreVariations] = useState<boolean>(false)

  const reload = () => {
    if (iframeRef.current) {
      iframeRef.current.reloadIframe()
    }
  }

  // get the display url for og:image
  const displayUrl = token.metadata?.displayUri && ipfsGatewayUrl(
    token.metadata.displayUri
  )

  // the direct URL to the resource to display in the <iframe>
  const artifactUrl = useMemo<string>(() => {
    // if no hash is forced, use the artifact URI directly
    if (!previewHash) {
      return ipfsGatewayUrl(token.metadata.artifactUri, "ipfsio")
    }
    else {
      // there is a forced hash, add it to the generative URL
      return `${ipfsGatewayUrl(token.metadata.generativeUri, "ipfsio")}/?fxhash=${previewHash}`
    }
  }, [previewHash])

  // should we display the image instead of the live code ?
  const displayImage = settings.quality === 0 || forceImageDisplay

  return (
    <>
      <SquareContainer>
        <ArtworkFrame>
          {settings.quality === 0 && !exploreVariations ? (
            <img src={displayUrl} alt={`${token.name} preview`}/>
          ):(
            <ArtworkIframe 
              ref={iframeRef}
              url={artifactUrl}
              hasLoading={false}
            />
          )}
        </ArtworkFrame>
      </SquareContainer>

      <Spacing size="8px"/>

      <div className={cs(layout['x-inline'], style.artwork_buttons)}>
        <ButtonVariations
          token={token}
          previewHash={previewHash}
          onChangeHash={(hash) => {
            setExploreVariations(true)
            setPreviewHash(hash)
          }}
        />
        {displayImage && !exploreVariations ? (
          <Button
            size="small"
            color="transparent"
            iconComp={<i aria-hidden className="fas fa-play"/>}
            iconSide="right"
            onClick={() => setExploreVariations(true)}
          >
            run
          </Button>
        ):(
          <Button
            size="small"
            color="transparent"
            iconComp={<i aria-hidden className="fas fa-redo"/>}
            iconSide="right"
            onClick={reload}
          >
            reload
          </Button>
        )}
        <Link href={artifactUrl} passHref>
          <Button
            isLink={true}
            size="small"
            color="transparent"
            iconComp={<i aria-hidden className="fas fa-external-link-square"/>}
            // @ts-ignore
            target="_blank"
            iconSide="right"
          >
            open
          </Button>
        </Link>
      </div>
    </>
  )
}