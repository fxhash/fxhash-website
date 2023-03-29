import style from "./StepConfigureCapture.module.scss"
import Link from "next/link"
import styleC from "./StepCheckFiles.module.scss"
import cs from "classnames"
import { StepComponent } from "../../types/Steps"
import { Spacing } from "../../components/Layout/Spacing"
import { ArtworkPreview } from "../../components/Artwork/Preview"
import { Button } from "../../components/Button"
import { useState, useEffect, useMemo } from "react"
import useFetch, { CachePolicies } from "use-http"
import {
  PreviewError,
  PreviewErrorResponse,
  PreviewResponse,
  TestPreviewError,
  TestPreviewErrorResponse,
  TestPreviewResponse,
} from "../../types/Responses"
import { Error } from "../../components/Error/Error"
import { getPreviewError, getTestPreviewError } from "../../utils/errors"
import { CaptureSettings } from "../../types/Mint"
import { InputCaptureSettings } from "../../components/Input/CaptureSettngs"
import { validateCaptureSettings } from "../../utils/validations"
import { LinkGuide } from "../../components/Link/LinkGuide"
import { ipfsUrlWithHashAndParams } from "../../utils/ipfs"

export const StepConfigureCapture: StepComponent = ({ onNext, state }) => {
  const [settings, setSettings] = useState<CaptureSettings>(
    state.captureSettings ?? {
      mode: null,
      triggerMode: null,
      delay: 2000,
      resX: 800,
      resY: 800,
      gpu: false,
    }
  )
  const { data, loading, error, post } = useFetch<
    TestPreviewResponse | TestPreviewErrorResponse
  >(`${process.env.NEXT_PUBLIC_API_EXTRACT}/extract`, {
    cachePolicy: CachePolicies.NO_CACHE,
    responseType: "json",
  })

  // extract the presigned URL from the response, if there's one
  const testImage = useMemo(
    () => (data && !error ? (data as TestPreviewResponse).capture : null),
    [data, error]
  )

  const {
    data: previewData,
    loading: previewLoading,
    error: previewError,
    post: previewPost,
  } = useFetch<PreviewResponse | PreviewErrorResponse>(
    `${process.env.NEXT_PUBLIC_API_FILE_ROOT}/preview`,
    { cachePolicy: CachePolicies.NO_CACHE }
  )

  // this variable ensures that we can safely access its data regardless of the state of the queries
  const safeDataPreview: PreviewResponse | false | undefined =
    !previewError && !previewLoading && (previewData as PreviewResponse)

  const captureTest = () => {
    post({
      cid: ipfsUrlWithHashAndParams(
        state.cidUrlParams!,
        state.previewHash!,
        state.previewInputBytes!,
        (cid) => cid
      ),
      mode: settings.mode,
      triggerMode: settings.triggerMode,
      canvasSelector: settings.canvasSelector,
      resX: settings.resX,
      resY: settings.resY,
      delay: settings.delay,
      gpu: settings.gpu,
      withFeatures: false,
      priority: "high",
    })
  }

  const sendCapture = () => {
    if (validateCaptureSettings(settings)) {
      previewPost({
        mode: settings.mode,
        triggerMode: settings.triggerMode,
        resX: settings.resX,
        resY: settings.resY,
        delay: settings.delay,
        gpu: settings.gpu,
        canvasSelector: settings.canvasSelector,
        cidParams: state.cidUrlParams,
        previewHash: state.previewHash,
        previewInputBytes: state.previewInputBytes,
        authHash: state.authHash1,
      })
    }
  }

  useEffect(() => {
    if (safeDataPreview) {
      onNext({
        captureSettings: {
          mode: safeDataPreview.mode,
          triggerMode: safeDataPreview.triggerMode,
          resX: safeDataPreview.resX,
          resY: safeDataPreview.resY,
          delay: safeDataPreview.delay,
          canvasSelector: safeDataPreview.canvasSelector,
          gpu: safeDataPreview.gpu,
        },
        cidPreview: safeDataPreview.cidPreview,
        cidThumbnail: safeDataPreview.cidThumbnail,
        authHash2: safeDataPreview.authenticationHash,
      })
    }
  }, [safeDataPreview])

  //
  const testPreviewError: TestPreviewError | null = error
    ? data
      ? (data as TestPreviewErrorResponse).error
      : TestPreviewError.UNKNOWN
    : null

  return (
    <>
      <p>
        When collectors will{" "}
        <strong>mint a token from your Generative Token</strong>, fxhash will
        generate a preview image to go with their Token. <br />
        You need to configure how this preview will be taken by fxhash capture
        module.
        <br />
        Read more about the different{" "}
        <LinkGuide
          href="/doc/artist/project-settings#capture-settings"
          newTab={true}
        >
          capture strategies in the guide
        </LinkGuide>
      </p>

      <Spacing size="5x-large" sm="none" />

      <div className={cs(styleC.container)}>
        <div className={cs(style.inputs)}>
          <InputCaptureSettings settings={settings} onChange={setSettings} />

          <Spacing size="3x-large" sm="x-large" />

          {testPreviewError && (
            <Error>
              {getTestPreviewError(
                testPreviewError || TestPreviewError.UNKNOWN
              )}
            </Error>
          )}

          <Button
            onClick={captureTest}
            state={loading ? "loading" : "default"}
            color="black"
            size="regular"
            style={{
              alignSelf: "center",
            }}
            disabled={!validateCaptureSettings(settings)}
            className={style.button}
          >
            test capture
          </Button>
        </div>

        <div className={cs(styleC.artwork)}>
          <div className={cs(styleC["preview-cont"])}>
            <div className={cs(styleC["preview-wrapper"])}>
              <ArtworkPreview url={testImage || ""} alt="Preview capture" />
            </div>
          </div>
        </div>
      </div>

      <Spacing size="6x-large" sm="x-large" />

      <div className={cs(style.bottom)}>
        {previewError && (
          <Error>{getPreviewError(previewData as any as PreviewError)}</Error>
        )}

        <Button
          color="secondary"
          iconComp={<i aria-hidden className="fas fa-arrow-right" />}
          iconSide="right"
          size="large"
          state={previewLoading ? "loading" : "default"}
          onClick={sendCapture}
          disabled={!validateCaptureSettings(settings)}
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
