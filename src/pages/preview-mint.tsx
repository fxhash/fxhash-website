import { NextPage } from "next"
import { useRouter } from "next/router"
import { SectionHeader } from "../components/Layout/SectionHeader"
import { Spacing } from "../components/Layout/Spacing"
import style from "../styles/PreviewMint.module.scss"
import layout from "../styles/Layout.module.scss"
import cs from "classnames"
import { useMemo, useRef } from "react"
import {
  ArtworkIframe,
  ArtworkIframeRef,
} from "../components/Artwork/PreviewIframe"
import { Button } from "../components/Button"
import { ArtworkPreview } from "../components/Artwork/Preview"
import Head from "next/head"
import { TitleHyphen } from "../components/Layout/TitleHyphen"
import { ipfsGatewayUrl } from "../services/Ipfs"

const PreviewMintPage: NextPage = () => {
  const router = useRouter()
  const iframeRef = useRef<ArtworkIframeRef>(null)

  const urlLive = useMemo<string | null>(() => {
    return ipfsGatewayUrl(router.query.cidLive as string) || null
  }, [router.query])

  const urlPreview = useMemo<string | null>(() => {
    return ipfsGatewayUrl(router.query.cidPreview as string) || null
  }, [router.query])

  const reload = () => {
    if (iframeRef.current) {
      iframeRef.current.reloadIframe()
    }
  }

  return (
    <>
      <Head>
        <title>fxhash — discover your token</title>
        <meta
          key="og:title"
          property="og:title"
          content="fxhash — discover your token"
        />
        <meta
          key="description"
          name="description"
          content="Token recently minted on fxhash"
        />
        <meta
          key="og:description"
          property="og:description"
          content="Token recently minted on fxhash"
        />
      </Head>

      <Spacing size="6x-large" />

      <section>
        <SectionHeader>
          <TitleHyphen>preview of your token</TitleHyphen>
        </SectionHeader>

        <Spacing size="x-large" />

        <main className={cs(layout["padding-big"], layout.cols2)}>
          {urlLive && (
            <div className={cs(style.artwork)}>
              <h6>Live</h6>
              <div className={cs(style["iframe-container"])}>
                <div className={cs(style["iframe-wrapper"])}>
                  <ArtworkIframe
                    ref={iframeRef}
                    url={urlLive}
                    textWaiting="Waiting for content to be reachable"
                  />
                </div>
              </div>

              <div className={cs(style.buttons)}>
                <Button
                  size="small"
                  iconComp={<i aria-hidden className="fas fa-redo" />}
                  iconSide="right"
                  onClick={reload}
                >
                  reload
                </Button>
                <Button
                  isLink
                  // @ts-ignore
                  href={urlLive}
                  target="_blank"
                  size="small"
                  iconComp={
                    <i aria-hidden className="fas fa-external-link-alt" />
                  }
                  iconSide="right"
                >
                  open in new tab
                </Button>
              </div>
            </div>
          )}

          {urlPreview && (
            <div className={cs(style.artwork)}>
              <h6>Image</h6>
              <div className={cs(style["iframe-container"])}>
                <div className={cs(style["iframe-wrapper"])}>
                  <ArtworkPreview url={urlPreview} />
                </div>
              </div>

              <Button
                isLink
                // @ts-ignore
                href={urlPreview}
                target="_blank"
                size="small"
                iconComp={
                  <i aria-hidden className="fas fa-external-link-alt" />
                }
                iconSide="right"
              >
                open in new tab
              </Button>
            </div>
          )}
        </main>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

export default PreviewMintPage
