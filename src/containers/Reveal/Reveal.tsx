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


interface Props {
  generativeUri: string
  previeweUri: string
  features?: TokenFeature[]|null
}

/**
 * The Reveal component displays a token with metadata assigned in a proper way
 * It does the following:
 *  - starts to load the token in a hidden <iframe>
 *  - display a loader while <iframe> is loading
 *  - once iframe is loaded, reveal it with a flipping effect
 */
export function Reveal({ generativeUri, previeweUri, features }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const viewUrl = useMemo<string>(() => ipfsGatewayUrl(generativeUri, "ipfsio"), [generativeUri])

  const reloadIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }

  return (
    <>
      <div className={cs(layout.full_body_height, style.container)}>
        <RevealIframe
          ref={iframeRef}
          url={viewUrl}
        />
        <div className={cs(layout['x-inline'])}>
          <Button
            size="small"
            iconComp={<i aria-hidden className="fas fa-redo"/>}
            iconSide="right"
            onClick={reloadIframe}
          >
            reload
          </Button>
          <Link href={viewUrl} passHref>
            <Button
              isLink={true}
              size="small"
              iconComp={<i aria-hidden className="fas fa-external-link-alt"></i>}
              // @ts-ignore
              target="_blank"
            >
              open live
            </Button>
          </Link>
        </div>
      </div>

      {features && features.length > 0 && (
        <section>
          <Spacing size="6x-large"/>
          <SectionHeader>
            <TitleHyphen>Features</TitleHyphen>
          </SectionHeader>
          <Spacing size="3x-large"/>
          <main className={cs(layout['padding-big'])}>
            <Features features={features} />
          </main>
        </section>
      )}
    </>
  )
}