import style from "./Sandbox.module.scss"
import cs from "classnames"
import { ArtworkIframe, ArtworkIframeRef } from "../../components/Artwork/PreviewIframe"
import { Dropzone } from "../../components/Input/Dropzone"
import { useState, useMemo, useRef } from "react"
import Link from "next/link"
import { Button } from "../../components/Button"
import useFetch, { CachePolicies } from "use-http"
import { FileSandboxResponse } from "../../types/Files"
import { Spacing } from "../../components/Layout/Spacing"
import { FileList } from "./FileList"
import { ButtonFile } from "../../components/Button/ButtonFile"
import { getFileUploadError } from "../../utils/errors"
import { FileUploadError } from "../../types/errors"
import { HashTest } from "../../components/Testing/HashTest"


export function Sandbox() {
  const artworkIframeRef = useRef<ArtworkIframeRef>(null)
  const [file, setFile] = useState<File|null>(null)
  const [hash, setHash] = useState<string|null>(null)

  const { post, loading, error, data } = useFetch<FileSandboxResponse|FileUploadError>(`${process.env.NEXT_PUBLIC_API_FILE_ROOT}/upload-sandbox`, {
    cachePolicy: CachePolicies.NO_CACHE
  })
  
  // this variable ensures that we can safely access its data regardless of the state of the queries
  const safeData: FileSandboxResponse|false|undefined = !error && !loading && (data as FileSandboxResponse)

  // create the url to which the <iframe> needs to point
  const url = useMemo(() => {
    if (!safeData) return ""
    return `${safeData.url}?fxhash=${hash}`
  }, [hash])

  const uploadFile = async () => {
    if (file) {
      const form = new FormData()
      form.append("file", file)
      await post(form)
    }
  }

  const updateFile = async (file: File|null) => {
    if (file) {
      setFile(file)
      const form = new FormData()
      form.append("file", file)
      await post(form)
    }
  }

  return (
    <section className={cs(style.container, {
      [style['artwork-view']]: !!safeData
    })}>
      <div>
        {error && (
          <>
            <div className={cs(style.error)}>
              <i aria-hidden className="fas fa-exclamation-triangle"/>
              <span>
                <strong>An error occurred when uploading your project</strong>
                <p>{getFileUploadError(data as FileUploadError)}</p>
              </span>
            </div>
            <Spacing size="regular"/>
          </>
        )}

        {safeData ? (
          <div className={cs(style.testing)}>
            <div className={cs(style['files-header'])}>
              <h5>Files</h5>
              <span><i aria-hidden className="fas fa-file-archive"/> { safeData.filename }</span>
            </div>
            <Spacing size="3x-small"/>
            <FileList files={safeData.contents} />
            <Spacing size="2x-small"/>
            <ButtonFile 
              state={loading ? "loading" : "default"}
              accepted={[ "application/zip", "application/x-zip-compressed" ]}
              onFile={updateFile}
              size="small"
              style={{
                alignSelf: "flex-start"
              }}
            >
              update .zip
            </ButtonFile>

            <Spacing size="2x-large"/>

            <div>
              <h5>Testing</h5>
              <p>You need to verify that:</p>
              <ul>
                <li>a same hash will <strong>always</strong> generate the same output</li>
                <li>different hashes generate <strong>different</strong> outputs</li>
              </ul>

              <HashTest
                value={hash}
                onHashUpdate={hash => setHash(hash)}
                onRetry={() => {
                  artworkIframeRef.current?.reloadIframe()
                }}
              />
            </div>
          </div>
        ):(
          <div className={cs(style['drag-container'])}>
            <Dropzone
              className={cs(style.drag)}
              textDefault="Drag 'n' drop your ZIP file here"
              accepted={[ "application/zip", "application/x-zip-compressed" ]}
              onChange={(files: File[]|null) => {
                setFile(files && files.length > 0 ? files[0] : null)
              }}
              files={file ? [ file ] : null}
            />
            <Button
              color="secondary"
              state={loading ? "loading" : "default"}
              disabled={!file}
              onClick={() => uploadFile()}
            >
              start tests 
            </Button>
          </div>
        )}
      </div>

      <div className={cs(style.artwork)}>
        <div className={cs(style['iframe-container'])}>
          <div className={cs(style['iframe-wrapper'])}>
            <ArtworkIframe 
              ref={artworkIframeRef}
              url={url}
              textWaiting="Waiting for content to be reachable"
            />
          </div>
        </div>
        
        {url && (
          <Button
            isLink
            // @ts-ignore
            href={url} target="_blank"
            size="small"
            iconComp={<i aria-hidden className="fas fa-external-link-alt"/>}
            iconSide="right"
          >
            open live
          </Button>
        )}
      </div>
    </section>
  )
}