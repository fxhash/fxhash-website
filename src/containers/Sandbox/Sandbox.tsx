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
import { getFileUploadError, getProcessRawFeaturesError } from "../../utils/errors"
import { FileUploadError } from "../../types/errors"
import { HashTest } from "../../components/Testing/HashTest"
import { unzipFile } from "../../utils/files"
import { processZipSandbox } from "../../utils/sandbox"
import { SandboxPreview } from "../../components/Artwork/SandboxPreview"
import { SandboxFiles } from "../../types/Sandbox"
import { generateFxHash } from "../../utils/hash"
import { RawTokenFeatures } from "../../types/Metadata"
import { Features } from "../../components/Features/Features"
import { ErrorBlock } from "../../components/Error/ErrorBlock"
import { RawFeatures } from "../../components/Features/RawFeatures"


export function Sandbox() {
  const artworkIframeRef = useRef<ArtworkIframeRef>(null)
  const [file, setFile] = useState<File|null>(null)
  const [hash, setHash] = useState<string>(generateFxHash())
  const [filesRecord, setFilesRecord] = useState<SandboxFiles|null>(null)
  const [error, setError] = useState<string|null>(null)
  const [url, setUrl] = useState<string|null>(null)
  const [features, setFeatures] = useState<RawTokenFeatures | null>(null)

  const fileList = useMemo<string[]|null>(() => (
    filesRecord ? Object.keys(filesRecord) : null
  ), [filesRecord])

  const processFile = async (file: File) => {
    try {
      const record = await processZipSandbox(file)
      setFilesRecord(record)
    }
    catch (err) {
      // todo: process error
      console.error(err)
    }
  }

  const uploadFile = async () => {
    if (file) {
      processFile(file)
    }
  }

  const updateFile = async (file: File|null) => {
    if (file) {
      setFile(file)
      processFile(file)
    }
  }

  const iframeLoaded = () => {
    if (artworkIframeRef.current) {
      const iframe = artworkIframeRef.current.getHtmlIframe()
      if (iframe) {
        // @ts-ignore
        if (iframe.contentWindow?.$fxhashFeatures) {
          // @ts-ignore
          // process the raw features
          setFeatures(iframe.contentWindow?.$fxhashFeatures)
        }
        else {
          setFeatures(null)
        }
      }
    }
  }

  return (
    <section className={cs(style.container, {
      [style['artwork-view']]: !!filesRecord
    })}>
      <div>
        {error && (
          <>
            <div className={cs(style.error)}>
              <i aria-hidden className="fas fa-exclamation-triangle"/>
              <span>
                <strong>An error occurred when uploading your project</strong>
                <p>{error}</p>
              </span>
            </div>
            <Spacing size="regular"/>
          </>
        )}

        {filesRecord ? (
          <div className={cs(style.testing)}>
            <div className={cs(style['files-header'])}>
              <h5>Files</h5>
              <span><i aria-hidden className="fas fa-file-archive"/> { file?.name }</span>
            </div>
            <Spacing size="3x-small"/>
            <FileList files={fileList} />
            <Spacing size="2x-small"/>
            <ButtonFile 
              state={"default"}
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
                autoGenerate={false}
                value={hash}
                onHashUpdate={hash => setHash(hash)}
                onRetry={() => {
                  artworkIframeRef.current?.reloadIframe()
                }}
              />
            </div>

            <Spacing size="2x-large"/>

            <div>
              <h5>Features</h5>
              <Spacing size="small"/>
              <RawFeatures rawFeatures={features} />
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
              state={"default"}
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
            <SandboxPreview 
              hash={hash}
              ref={artworkIframeRef}
              record={filesRecord || undefined}
              textWaiting="Waiting for content to be reachable"
              onUrlUpdate={setUrl}
              onLoaded={iframeLoaded}
            />
          </div>
        </div>
        
        {url && (
          <Button
            isLink
            // @ts-ignore
            href={url} 
            target="_blank"
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