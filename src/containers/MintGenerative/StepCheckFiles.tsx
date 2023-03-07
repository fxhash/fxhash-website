import style from "./StepCheckFiles.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { StepComponent } from "../../types/Steps"
import { Spacing } from "../../components/Layout/Spacing"
import {
  ArtworkIframe,
  ArtworkIframeRef,
} from "../../components/Artwork/PreviewIframe"
import { useMemo, useState, useRef } from "react"
import { generateFxHash } from "../../utils/hash"
import { HashTest } from "../../components/Testing/HashTest"
import { Checkbox } from "../../components/Input/Checkbox"
import { Button } from "../../components/Button"
import { RawFeatures } from "../../components/Features/RawFeatures"
import { ArtworkFrame } from "../../components/Artwork/ArtworkFrame"
import { ipfsUrlWithHashAndParams } from "../../utils/ipfs"
import { ControlsTest } from "components/Testing/ControlsTest"
import {
  consolidateParams,
  serializeParams,
  strinigfyParams,
  sumBytesParams,
} from "components/FxParams/utils"
import { useReceiveTokenInfos } from "hooks/useReceiveTokenInfos"

export const StepCheckFiles: StepComponent = ({ onNext, state }) => {
  const [hash, setHash] = useState<string>(
    state.previewHash ?? generateFxHash()
  )
  const [check1, setCheck1] = useState<boolean>(false)
  const [check2, setCheck2] = useState<boolean>(false)
  const artworkIframeRef = useRef<ArtworkIframeRef>(null)
  const { onIframeLoaded, features, params } = useReceiveTokenInfos(
    artworkIframeRef.current
  )

  const [data, setData] = useState<Record<string, any> | null>({})

  const inputBytes = useMemo<string | null>(() => {
    const serialized = serializeParams(data, params || [])
    if (serialized.length === 0) return null
    return serialized
  }, [strinigfyParams(data), params])

  const url = useMemo<string>(() => {
    return ipfsUrlWithHashAndParams(state.cidUrlParams!, hash, inputBytes)
  }, [hash, inputBytes])

  console.log({ data })

  const nextStep = () => {
    onNext({
      previewHash: hash,
      previewInputBytes: inputBytes,
      params: {
        definition: params,
        // TODO: remove any here
        inputBytesSize: sumBytesParams(params as any),
      },
    })
  }

  const handleSubmitParams = (data: any) => {
    setData(data)
  }

  const renderArtwork = () => (
    <div className={cs(style.artworkWrapper)}>
      <div className={cs(style.artwork)}>
        <div className={cs(style["preview-cont"])}>
          <div className={cs(style["preview-wrapper"])}>
            <ArtworkFrame>
              <ArtworkIframe
                ref={artworkIframeRef}
                url={url}
                textWaiting="looking for content on IPFS"
                onLoaded={onIframeLoaded}
              />
            </ArtworkFrame>
          </div>
        </div>
      </div>
    </div>
  )
  return (
    <>
      <p>
        Now, double-check your Generative Token to see if it behaves properly on
        the IPFS network. <br />
        Sometimes, the IPFS network can be <strong>slow</strong> 🐢. Please be
        patient.
      </p>
      <p>
        On the next step, you will configure how previews will be generated each
        time your token is collected.
        <br />
        <strong>
          Use this step to find a hash you want to use for the thumbnail of the
          project on the platform.
        </strong>
      </p>

      <Spacing size="5x-large" sm="small" />

      <div className={cs(style.container)}>
        <div>
          <h5>Testing</h5>
          <p>You need to verify that:</p>
          <ul>
            <li>
              a same hash will <strong>always</strong> generate the same output
            </li>
            <li>
              different hashes generate <strong>different</strong> outputs
            </li>
          </ul>
          <div className={layout.show_sm}>{renderArtwork()}</div>

          <Spacing size="3x-large" sm="x-large" />

          <HashTest
            autoGenerate={false}
            value={hash}
            onHashUpdate={setHash}
            onRetry={() => {
              artworkIframeRef.current?.reloadIframe()
            }}
          />
          <Spacing size="2x-large" sm="x-large" />
          {params && (
            <div>
              <h5>Params</h5>
              <Spacing size="small" />
              <ControlsTest params={params} onSubmit={handleSubmitParams} />
            </div>
          )}
          <Spacing size="2x-large" sm="x-large" />
          <div>
            <h5>Features</h5>
            <Spacing size="small" />
            <RawFeatures rawFeatures={features} />
          </div>
        </div>
        <div className={layout.hide_sm}>{renderArtwork()}</div>
      </div>

      <Spacing size="6x-large" sm="x-large" />

      <div className={cs(style.checkboxes)}>
        <div>
          <Checkbox value={check1} paddingLeft={false} onChange={setCheck1}>
            I want to keep these settings for the preview of my project
          </Checkbox>
          <Checkbox value={check2} paddingLeft={false} onChange={setCheck2}>
            My Generative Token works properly
          </Checkbox>
        </div>
        <Spacing size="large" sm="regular" />

        <Button
          color="secondary"
          iconComp={<i aria-hidden className="fas fa-arrow-right" />}
          iconSide="right"
          size="large"
          disabled={!check1 || !check2}
          onClick={nextStep}
          className={style.button}
        >
          next step
        </Button>
      </div>

      <Spacing size="3x-large" />
      <Spacing size="3x-large" sm="none" />
      <Spacing size="3x-large" sm="none" />
    </>
  )
}
