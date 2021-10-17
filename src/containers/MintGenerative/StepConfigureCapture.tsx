import style from "./StepConfigureCapture.module.scss"
import styleC from "./StepCheckFiles.module.scss"
import cs from "classnames"
import { StepComponent } from "../../types/Steps"
import { Spacing } from "../../components/Layout/Spacing"
import { ArtworkPreview } from "../../components/Artwork/Preview"
import { Button } from "../../components/Button"
import { useState, useEffect } from "react"
import { SliderWithText } from "../../components/Input/SliderWithText"
import { Vec2 } from "../../types/Math"
import { InputResolution } from "../../components/Input/Resolution"
import useFetch, { CachePolicies } from "use-http"
import { CaptureErrorEnum, CaptureErrorResponse, CaptureResponse, PreviewError, PreviewResponse } from "../../types/Responses"
import { getIpfsIoUrl } from "../../utils/ipfs"
import { Error } from "../../components/Error/Error"
import { getCaptureError, getPreviewError } from "../../utils/errors"

export const StepConfigureCapture: StepComponent = ({ onNext, state }) => {
  const [time, setTime] = useState<number>(2)
  const [res, setRes] = useState<Vec2>({ x: 1024, y: 1024 })
  const [previewUrl, setPreviewUrl] = useState<string|null>(null)

  const { data, loading, error, post } = 
    useFetch<CaptureErrorResponse|CaptureResponse>(process.env.NEXT_PUBLIC_API_CAPTURE,
    { cachePolicy: CachePolicies.NO_CACHE })

  // this variable ensures that we can safely access its data regardless of the state of the queries
  const safeData: CaptureResponse|false|undefined = !error && !loading && (data as CaptureResponse)

  const { data: previewData, loading: previewLoading, error: previewError, post: previewPost } = 
    useFetch<PreviewResponse|PreviewError>(`${process.env.NEXT_PUBLIC_API_FILE_ROOT}/preview`,
    { cachePolicy: CachePolicies.NO_CACHE })

  // this variable ensures that we can safely access its data regardless of the state of the queries
  const safeDataPreview: PreviewResponse|false|undefined = !previewError && !previewLoading && (previewData as PreviewResponse)

  console.log({ previewData, previewError, previewLoading })
  console.log({ safeDataPreview })

  const captureTest = () => {
    post({
      url: getIpfsIoUrl(state.cidFixedHash!),
      resX: res.x,
      resY: res.y,
      delay: time * 1000
    })
  }

  const sendCapture = () => {
    const F = new FormData()
    F.append("resX", ""+res.x)
    F.append("resY", ""+res.y)
    F.append("delay", ""+(time*1000))
    F.append("cidParams", state.cidUrlParams!)
    F.append("cidStatic", state.cidFixedHash!)
    F.append("authHash", state.authHash2!)
    previewPost(F)
  }
  
  useEffect(() => {
    if (safeData) {
      setPreviewUrl(safeData.capture)
    }
  }, [safeData])

  useEffect(() => {
    if (safeDataPreview) {
      onNext({
        captureSettings: {
          resX: safeDataPreview.resX,
          resY: safeDataPreview.resY,
          delay: safeDataPreview.delay,
        },
        cidPreview: safeDataPreview.cidPreview,
        authHash3: safeDataPreview.authenticationHash
      })
    }
  }, [safeDataPreview])

  return (
    <>
      <p>
        When collectors will <strong>mint a token from your Generative Token</strong>, fxhash will generate a thumbnail to go with their Token. <br/>
        You need to configure how much time after your page is loaded fxhash will wait before taking the capture.
      </p>

      <Spacing size="5x-large"/>

      <div className={cs(styleC.container)}>
        <div className={cs(style.inputs)}>
          <h5>Time before capture is taken</h5>
          <p>Keep in mind that collectors will have to wait for the capture before their token is minted.</p>
          <SliderWithText
            min={0.1}
            max={40}
            step={0.1}
            value={time}
            onChange={setTime}
          />

          <Spacing size="3x-large"/>

          <h5>Capture resolution</h5>
          <p>A browser with this resolution will be spawned to take a fullscreen capture. [256; 2048]</p>
          <InputResolution
            value={res}
            onChange={setRes}
            min={256}
            max={2048}
            className={cs(style.resolution)}
          />

          <Spacing size="3x-large"/>

          {error && (
            <Error>
              { getCaptureError((data as CaptureErrorResponse).error) }
            </Error>
          )}

          <Button
            onClick={captureTest}
            state={loading ? "loading" : "default"}
            color="primary"
            style={{
              alignSelf: "center"
            }}
          >
            test capture
          </Button>
        </div>

        <div className={cs(styleC.artwork)}>
          <div className={cs(styleC['preview-cont'])}>
            <div className={cs(styleC['preview-wrapper'])}>
              <ArtworkPreview
                url={previewUrl || ""}
                alt="Preview capture"
              />
            </div>
          </div>
        </div>
      </div>

      <Spacing size="6x-large"/>

      <div className={cs(style.bottom)}>
        {previewError && (
          <Error>
            { getPreviewError(previewData as PreviewError) }
          </Error>
        )}

        <Button
          color="secondary"
          iconComp={<i aria-hidden className="fas fa-arrow-right"/>}
          iconSide="right"
          size="large"
          state={previewLoading ? "loading" : "default"}
          onClick={sendCapture}
        >
          Next step
        </Button>
      </div>

      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>
    </>
  )
}