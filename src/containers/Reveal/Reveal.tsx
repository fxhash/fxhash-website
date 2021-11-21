import style from "./Reveal.module.scss"
import layout from "../../styles/Layout.module.scss"
import effects from "../../styles/Effects.module.scss"
import cs from "classnames"
import Link from "next/link"
import { useMemo, useState, useRef } from "react"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import { Button } from "../../components/Button"
import { LoaderBlock } from "../../components/Layout/LoaderBlock"
import { ClientOnlyEmpty } from "../../components/Utils/ClientOnly"
import { TokenFeature } from "../../types/Metadata"
import { Features } from "../../components/Features/Features"
import { SectionHeader } from "../../components/Layout/SectionHeader"
import { TitleHyphen } from "../../components/Layout/TitleHyphen"
import { Spacing } from "../../components/Layout/Spacing"


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
  const [loaded, setLoaded] = useState(false)
  const viewUrl = useMemo<string>(() => ipfsGatewayUrl(generativeUri, "ipfsio"), [generativeUri])

  const isLoaded = () => {
    setTimeout(() => {
      setLoaded(true)
    }, 500)
  }

  const reloadIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }

  return (
    <>
      <div className={cs(layout.full_body_height, style.container)}>
        <div className={cs(style.iframe_container, effects['drop-shadow-big'], { [style.loaded]: loaded })}>
          <ClientOnlyEmpty>
            <iframe
              ref={iframeRef}
              onLoad={() => isLoaded()}
              // onReset
              src={viewUrl}
            />
          </ClientOnlyEmpty>
          <LoaderBlock
            height="100%"
            className={cs(style.loader)}
            color="white"
          >
            .loading token.
          </LoaderBlock>
        </div>

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