import style from "./StepUploadIpfs.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { useState, useEffect } from "react"
import { Dropzone } from "../../components/Input/Dropzone"
import { Spacing } from "../../components/Layout/Spacing"
import { ZIP_MIMES } from "../../utils/files"
import { Button } from "../../components/Button"
import useFetch, { CachePolicies } from "use-http"
import { FileUploadError } from "../../types/errors"
import { MintGenUploadProjectResponse } from "../../types/Responses"
import { getFileUploadError } from "../../utils/errors"
import { Error } from "../../components/Error/Error"
import { StepComponent } from "../../types/Steps"

export const StepUploadIpfs: StepComponent = ({ onNext }) => {
  const [file, setFile] = useState<File | null>(null)
  const { data, loading, error, post } = useFetch<
    MintGenUploadProjectResponse | FileUploadError
  >(`${process.env.NEXT_PUBLIC_API_FILE_ROOT}/upload-generative`, {
    cachePolicy: CachePolicies.NO_CACHE,
  })

  // this variable ensures that we can safely access its data regardless of the state of the queries
  const safeData: MintGenUploadProjectResponse | false | undefined =
    !error && !loading && (data as MintGenUploadProjectResponse)

  const upload = () => {
    if (file) {
      const F = new FormData()
      F.append("file", file)
      post(F)
    }
  }

  useEffect(() => {
    if (safeData) {
      onNext({
        cidUrlParams: safeData.cidParams,
        authHash1: safeData.authenticationHash,
      })
    }
  }, [safeData])

  return (
    <div className={cs(layout.y_centered)}>
      <p>
        The .zip file of your project needs to be uploaded on the{" "}
        <a href="https://ipfs.io/" target="_blank" rel="noreferrer">
          IPFS network
        </a>
        .
      </p>

      <Spacing size="2x-large" sm="regular" />

      <section className={cs(style["btn-cont"])}>
        <Dropzone
          textDefault="Drop your .zip file here (on click to browse)"
          accepted={ZIP_MIMES}
          files={file && [file]}
          onChange={(files) => files && files.length > 0 && setFile(files[0])}
          className={cs(style.dropzone)}
        />

        <Spacing size="4x-large" sm="x-large" />

        {error && <Error>{getFileUploadError(data as FileUploadError)}</Error>}

        <Button
          onClick={upload}
          color="secondary"
          iconComp={<i aria-hidden className="fas fa-arrow-right" />}
          iconSide="right"
          disabled={!file}
          size="large"
          className={style.button}
          state={loading ? "loading" : "default"}
        >
          upload
        </Button>
      </section>
      <Spacing size="none" sm="3x-large" />
    </div>
  )
}
