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
import { useReceiveTokenInfos } from "hooks/useReceiveTokenInfos"
interface Props {
  token: Pick<
    GenerativeToken,
    "metadata" | "labels" | "captureMedia" | "displayUri" | "name" | "balance"
  >
  forceImageDisplay?: boolean
  canStop?: boolean
  openUrl?: string
  openText?: string
  hideVariations?: boolean
  artifactUrl?: string
}
export function GenerativeArtwork({
  token,
  forceImageDisplay = false,
  openUrl,
  openText = "open",
  hideVariations,
  artifactUrl: artworkArtifactUrl,
}: Props) {
  const settings = useContext(SettingsContext)
  const artworkIframeRef = useRef<ArtworkIframeRef>(null)

  const { params, onIframeLoaded } = useReceiveTokenInfos(artworkIframeRef)
  // used to preview the token in the iframe with different hashes
  const [previewHash, setPreviewHash] = useState<string | null>(
    token.metadata.previewHash || null
  )
  const [previewInputBytes, setPreviewInputBytes] = useState<string | null>(
    token.metadata.previewInputBytes || null
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
    if (artworkIframeRef.current) {
      artworkIframeRef.current.reloadIframe()
    }
  }

  // the direct URL to the resource to display in the <iframe>
  const artifactUrl = useMemo<string>(() => {
    if (artworkArtifactUrl) return artworkArtifactUrl
    // if no hash is forced, use the artifact URI directly
    if (!previewHash) {
      return ipfsGatewayUrl(token.metadata.artifactUri)
    } else {
      // there is a forced hash, add it to the generative URL
      let url = `${ipfsGatewayUrl(
        token.metadata.generativeUri
      )}/?fxhash=${previewHash}`
      if (previewInputBytes) {
        url += `&fxparams=${previewInputBytes}`
      }
      return url
    }
  }, [previewHash, previewInputBytes])

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
              ref={artworkIframeRef}
              url={artifactUrl}
              hasLoading={false}
              onLoaded={onIframeLoaded}
            />
          )}
        </ArtworkFrame>
      </SquareContainer>

      <Spacing size="8px" />

      <div className={cs(layout["x-inline"], style.artwork_buttons)}>
        {!hideVariations && (
          <ButtonVariations
            token={token}
            previewHash={previewHash}
            params={params}
            onChangeHash={(hash, inputBytes) => {
              setDisplayImage(false)
              setPreviewHash(hash)
              if (inputBytes) setPreviewInputBytes(inputBytes)
            }}
          />
        )}
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
