import style from "./Reveal.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import Link from "next/link"
import { useMemo, useState, useRef } from "react"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import { Button } from "../../components/Button"
import { TokenFeature } from "../../types/Metadata"
import { Features } from "../../components/Features/Features"
import { SectionHeader } from "../../components/Layout/SectionHeader"
import { TitleHyphen } from "../../components/Layout/TitleHyphen"
import { Spacing } from "../../components/Layout/Spacing"
import { RevealIframe } from "../../components/Reveal/RevealIframe"
import { fxParamsAsQueryParams } from "components/FxParams/utils"
import { generateRandomStringSequence } from "utils/getRandomStringSequence"

interface Props {
  generativeUri: string
  hash: string
  iteration: number
  minter: string
  params?: string
  previeweUri?: string
  features?: TokenFeature[] | null
  snippetVersion: string
}

/**
 * The Reveal component displays a token with metadata assigned in a proper way
 * It does the following:
 *  - starts to load the token in a hidden <iframe>
 *  - display a loader while <iframe> is loading
 *  - once iframe is loaded, reveal it with a flipping effect
 */
export function Reveal({
  hash,
  iteration,
  minter,
  params,
  generativeUri,
  features,
  snippetVersion,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const viewUrl = useMemo<string>(() => {
    let url
    // the old system doesn't include fxhash in the generative Uri,
    // so we have to add it if needed
    if (generativeUri.includes("fxhash")) {
      url = ipfsGatewayUrl(generativeUri)
    } else {
      url = `${ipfsGatewayUrl(generativeUri)}/?fxhash=${hash}`
    }
    url += `&fxiteration=${iteration}`
    url += `&fxminter=${minter}`
    // append params if defined
    if (params && params.length > 0) {
      if (fxParamsAsQueryParams(snippetVersion || "")) {
        url += `&fxparams=${params}`
      } else {
        url += `&fxparamsUpdate=${generateRandomStringSequence(3)}`
        url += `#${params}`
      }
    }
    return url
  }, [generativeUri, hash, iteration, minter, params, snippetVersion])

  const reloadIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }

  return (
    <>
      <div className={cs(layout.full_body_height, style.container)}>
        <RevealIframe ref={iframeRef} url={viewUrl} />
        <div className={cs(layout["x-inline"])}>
          <Button
            size="small"
            iconComp={<i aria-hidden className="fas fa-redo" />}
            iconSide="right"
            onClick={reloadIframe}
            color="transparent"
          >
            reload
          </Button>
          <Link href={viewUrl} passHref>
            <Button
              isLink={true}
              size="small"
              iconComp={
                <i aria-hidden className="fas fa-external-link-square" />
              }
              // @ts-ignore
              target="_blank"
              iconSide="right"
              color="transparent"
            >
              open live
            </Button>
          </Link>
        </div>
      </div>

      {features && features.length > 0 && (
        <section>
          <Spacing size="6x-large" />
          <SectionHeader>
            <TitleHyphen>Features</TitleHyphen>
          </SectionHeader>
          <Spacing size="3x-large" />
          <main className={cs(layout["padding-big"])}>
            <Features features={features} />
          </main>
        </section>
      )}
    </>
  )
}
