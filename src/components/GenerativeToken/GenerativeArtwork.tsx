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
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { SettingsContext } from "../../context/Theme"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import { Image } from "../Image"

interface Props {
  token: GenerativeToken
  forceImageDisplay?: boolean
  canStop?: boolean
  openUrl?: string
  openText?: string
}
export function GenerativeArtwork({
  token,
  forceImageDisplay = false,
  openUrl,
  openText = "open",
}: Props) {
  const settings = useContext(SettingsContext)
  const iframeRef = useRef<ArtworkIframeRef>(null)

  // used to preview the token in the iframe with different hashes
  const [previewHash, setPreviewHash] = useState<string | null>(
    token.metadata.previewHash || null
  )
  // forcing image display as a state
  const [displayImage, setDisplayImage] = useState(
    settings.quality === 0 || forceImageDisplay
  )

  // update the state of display image if we record a change in settings
  useEffect(() => {
    setDisplayImage(settings.quality === 0 || forceImageDisplay)
  }, [settings.quality])

  const reload = () => {
    if (iframeRef.current) {
      iframeRef.current.reloadIframe()
    }
  }

  // the direct URL to the resource to display in the <iframe>
  const artifactUrl = useMemo<string>(() => {
    // if no hash is forced, use the artifact URI directly
    if (!previewHash) {
      return ipfsGatewayUrl(token.metadata.artifactUri)
    } else {
      // there is a forced hash, add it to the generative URL
      return `${ipfsGatewayUrl(
        token.metadata.generativeUri
      )}/?fxhash=${previewHash}`
    }
  }, [previewHash])

  return (
    <>
      <SquareContainer>
        <ArtworkFrame tokenLabels={token.labels}>
          {displayImage ? (
            <Image
              image={token.captureMedia}
              ipfsUri={token.displayUri}
              alt={`${token.name} preview`}
              trueResolution
            />
          ) : (
            <ArtworkIframe
              tokenLabels={token.labels}
              ref={iframeRef}
              url={artifactUrl}
              hasLoading={false}
            />
          )}
        </ArtworkFrame>
      </SquareContainer>

      <Spacing size="8px" />

      <div className={cs(layout["x-inline"], style.artwork_buttons)}>
        <ButtonVariations
          token={token}
          previewHash={previewHash}
          onChangeHash={(hash) => {
            setDisplayImage(false)
            setPreviewHash(hash)
          }}
        />
        {displayImage ? (
          <Button
            type="button"
            size="small"
            color="transparent"
            iconComp={<i aria-hidden className="fas fa-play" />}
            iconSide="right"
            onClick={() => {
              setPreviewHash(token.metadata.previewHash || null)
              setDisplayImage(false)
            }}
          >
            run
          </Button>
        ) : (
          <>
            <Button
              type="button"
              size="small"
              color="transparent"
              iconComp={<i aria-hidden className="fas fa-stop" />}
              iconSide="right"
              onClick={() => setDisplayImage(true)}
            >
              stop
            </Button>
            <Button
              type="button"
              size="small"
              color="transparent"
              iconComp={<i aria-hidden className="fas fa-redo" />}
              iconSide="right"
              onClick={reload}
            >
              reload
            </Button>
          </>
        )}
        <Link href={openUrl || artifactUrl} passHref>
          <Button
            isLink={true}
            size="small"
            color="transparent"
            iconComp={<i aria-hidden className="fas fa-external-link-square" />}
            // @ts-ignore
            target="_blank"
            iconSide="right"
          >
            {openText}
          </Button>
        </Link>
      </div>
    </>
  )
}
