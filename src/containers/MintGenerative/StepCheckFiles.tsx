import style from "./StepCheckFiles.module.scss"
import cs from "classnames"
import { StepComponent } from "../../types/Steps"
import { Spacing } from "../../components/Layout/Spacing"
import { ArtworkIframe, ArtworkIframeRef } from "../../components/Artwork/PreviewIframe"
import { useMemo, useState, useRef, useEffect } from "react"
import { generateFxHash } from "../../utils/hash"
import { HashTest } from "../../components/Testing/HashTest"
import { Checkbox } from "../../components/Input/Checkbox"
import { Button } from "../../components/Button"
import { RawTokenFeatures } from "../../types/Metadata"
import { RawFeatures } from "../../components/Features/RawFeatures"
import { ArtworkFrame } from "../../components/Artwork/ArtworkFrame"
import { ipfsGatewayUrl } from "../../services/Ipfs"


export const StepCheckFiles: StepComponent = ({ onNext, state }) => {
  const [hash, setHash] = useState<string>(
    state.previewHash ?? generateFxHash()
  )
  const [check1, setCheck1] = useState<boolean>(false)
  const [check2, setCheck2] = useState<boolean>(false)
  const artworkIframeRef = useRef<ArtworkIframeRef>(null)
  const [features, setFeatures] = useState<RawTokenFeatures | null>(null)

  const url = useMemo<string>(() => {
    return `${ipfsGatewayUrl(state.cidUrlParams!)}?fxhash=${hash}`
  }, [hash])

  const nextStep = () => {
    onNext({
      previewHash: hash
    })
  }

  // attach event to window to get messages from 
  useEffect(() => {
    const listener = (e: any) => {
      if (e.data && e.data.id === "fxhash_getFeatures") {
        if (e.data.data) {
          setFeatures(e.data.data)
        }
        else {
          setFeatures(null)
        }
      }
    }
    // Listen to message from child window
    window.addEventListener("message", listener, false)

    // remove listener when component unmounts
    return () => {
      window.removeEventListener("message", listener, false)
    }
  }, [])

  const iframeLoaded = () => {
    if (artworkIframeRef.current) {
      const iframe = artworkIframeRef.current.getHtmlIframe()
      if (iframe) {
        iframe.contentWindow?.postMessage("fxhash_getFeatures", "*")
      }
    }
  }

  return (
    <>
      <p>
        Now, double-check your Generative Token to see if it behaves properly on the IPFS network. <br/>
        Sometimes, the IPFS network can be <strong>slow</strong> 🐢. Please be patient.
      </p>
      <p>
        On the next step, you will configure how previews will be generated each time your token is collected.<br/>
        <strong>Use this step to find a hash you want to use for the thumbnail of the project on the platform.</strong>
      </p>

      <Spacing size="5x-large"/>

      <div className={cs(style.container)}>
        <div>
          <h5>Testing</h5>
          <p>You need to verify that:</p>
          <ul>
            <li>a same hash will <strong>always</strong> generate the same output</li>
            <li>different hashes generate <strong>different</strong> outputs</li>
          </ul>

          <Spacing size="3x-large"/>

          <HashTest
            autoGenerate={false}
            value={hash}
            onHashUpdate={setHash}
            onRetry={() => {
              artworkIframeRef.current?.reloadIframe()
            }}
          />

          <Spacing size="2x-large"/>

          <div>
            <h5>Features</h5>
            <Spacing size="small"/>
            <RawFeatures rawFeatures={features} />
          </div>
        </div>

        <div className={cs(style.artwork)}>
          <div className={cs(style['preview-cont'])}>
            <div className={cs(style['preview-wrapper'])}>
              <ArtworkFrame>
                <ArtworkIframe
                  ref={artworkIframeRef}
                  url={url}
                  textWaiting="looking for content on IPFS"
                  onLoaded={iframeLoaded}
                />
              </ArtworkFrame>
            </div>
          </div>
        </div>
      </div>

      <Spacing size="6x-large"/>

      <div className={cs(style.checkboxes)}>
        <div>
          <Checkbox value={check1} onChange={setCheck1}>
            I want to keep this hash for the preview of my project
          </Checkbox>
          <Checkbox value={check2} onChange={setCheck2}>
            My Generative Token works properly
          </Checkbox>
        </div>
        <Spacing size="large"/>

        <Button
          color="secondary"
          iconComp={<i aria-hidden className="fas fa-arrow-right"/>}
          iconSide="right"
          size="large"
          disabled={!check1 || !check2}
          onClick={nextStep}
        >
          next step
        </Button>
      </div>

      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>
    </>
  )
}