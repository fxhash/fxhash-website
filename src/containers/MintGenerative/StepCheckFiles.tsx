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
import { generateFxHash, generateTzAddress } from "../../utils/hash"
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
  stringifyParamsData,
  sumBytesParams,
} from "components/FxParams/utils"
import { useReceiveTokenInfos } from "hooks/useReceiveTokenInfos"
import { FxParamsData } from "components/FxParams/types"
import { MinterTest } from "components/Testing/MinterTest"
import { IterationTest } from "components/Testing/IterationTest"

export const StepCheckFiles: StepComponent = ({ onNext, state }) => {
  const [hash, setHash] = useState<string>(
    state.previewHash ?? generateFxHash()
  )
  const [minter, setMinter] = useState<string>(
    state?.previewMinter ?? generateTzAddress()
  )
  const [iteration, setIteration] = useState<number>(
    state.previewIteration ?? 1
  )
  const [check1, setCheck1] = useState<boolean>(false)
  const [check2, setCheck2] = useState<boolean>(false)
  const artworkIframeRef = useRef<ArtworkIframeRef>(null)
  const { onIframeLoaded, features, params, paramsDefinition } =
    useReceiveTokenInfos(artworkIframeRef)

  const [data, setData] = useState<FxParamsData>({})

  const inputBytes = useMemo<string | null>(() => {
    const serialized = serializeParams(data, params || [])
    if (serialized.length === 0) return null
    return serialized
  }, [stringifyParamsData(data), params])

  const url = useMemo<string>(() => {
    return ipfsUrlWithHashAndParams(
      state.cidUrlParams!,
      hash,
      iteration,
      minter,
      inputBytes
    )
  }, [hash, iteration, minter, inputBytes])

  const nextStep = () => {
    onNext({
      previewHash: hash,
      previewIteration: iteration,
      previewMinter: minter,
      previewInputBytes: inputBytes,
      params: {
        definition: paramsDefinition,
        // TODO: remove any here
        inputBytesSize: sumBytesParams(
          // TODO: find a better solution, this is not very clean
          // virtually inject a version into each parameter
          (paramsDefinition as any)?.map((def: any) => ({
            ...def,
            version: "3.0.1",
          }))
        ),
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
          <div className={layout.show_sm}>
            <div className={cs(style.artworkWrapper)}>
              <div className={cs(style.artwork)}>
                <div className={cs(style["preview-cont"])}>
                  <div className={cs(style["preview-wrapper"])}>
                    <ArtworkFrame>
                      <ArtworkIframe
                        url={url}
                        textWaiting="looking for content on IPFS"
                        onLoaded={onIframeLoaded}
                      />
                    </ArtworkFrame>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Spacing size="3x-large" sm="x-large" />

          <HashTest
            autoGenerate={false}
            value={hash}
            onHashUpdate={setHash}
            onRetry={() => {
              artworkIframeRef.current?.reloadIframe()
            }}
          />
          <Spacing size="large" sm="x-large" />

          <IterationTest
            autoGenerate={false}
            value={iteration}
            onIterationUpdate={setIteration}
          />
          <Spacing size="large" sm="x-large" />

          <MinterTest
            autoGenerate={false}
            value={minter}
            onMinterUpdate={setMinter}
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
        <div className={layout.hide_sm}>
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
        </div>
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
