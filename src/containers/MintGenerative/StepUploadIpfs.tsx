import style from "./StepUploadIpfs.module.scss"
import cs from "classnames"
import { useState, useEffect } from "react"
import { Dropzone } from "../../components/Input/Dropzone"
import { Spacing } from "../../components/Layout/Spacing"
import { ZIP_MIMES } from "../../utils/files"
import { Button } from "../../components/Button"
import useFetch, { CachePolicies } from "use-http"
import { FileUploadError } from "../../types/errors"
import { MintGenUploadProjectResponse } from "../../types/Responses"
import { ErrorBlock } from "../../components/Error/ErrorBlock"
import { getFileUploadError } from "../../utils/errors"
import { Error } from "../../components/Error/Error"
import { StepComponent } from "../../types/Steps"


export const StepUploadIpfs: StepComponent = ({ onNext }) => {
  const [file, setFile] = useState<File|null>(null)
  const { data, loading, error, post } = 
    useFetch<MintGenUploadProjectResponse|FileUploadError>(`${process.env.NEXT_PUBLIC_API_FILE_ROOT}/upload-generative`,
    { cachePolicy: CachePolicies.NO_CACHE })

  // this variable ensures that we can safely access its data regardless of the state of the queries
  const safeData: MintGenUploadProjectResponse|false|undefined = !error && !loading && (data as MintGenUploadProjectResponse)

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
        authHash1: safeData.authenticationHash
      })
    }
  }, [safeData])
  
  return (
    <>
      <p>First, you need to upload the .zip file of your Generative Project on the <a href="https://ipfs.io/" target="_blank">IPFS network</a>.</p>

      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>

      <section className={cs(style['btn-cont'])}>
        <Dropzone
          textDefault="Drop your .zip file here (on click to browse)"
          accepted={ZIP_MIMES}
          files={file && [file]}
          onChange={(files) => files && files.length>0 && setFile(files[0])}
          className={cs(style.dropzone)}
        />

        <Spacing size="3x-large"/>
        <Spacing size="3x-large"/>

        {error && (
          <Error>
            { getFileUploadError(data as FileUploadError) }
          </Error>
        )}

        <Button
          onClick={upload}
          color="secondary"
          disabled={!file}
          size="large"
          state={loading ? "loading" : "default"}
        >
          upload
        </Button>
      </section>
    </>
  )
}