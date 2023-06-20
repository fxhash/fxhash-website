import style from "./Sandbox.module.scss"
import cs from "classnames"
import { ArtworkIframeRef } from "../../components/Artwork/PreviewIframe"
import { Dropzone } from "../../components/Input/Dropzone"
import { useState, useMemo, useRef, useEffect } from "react"
import { Button } from "../../components/Button"
import { Spacing } from "../../components/Layout/Spacing"
import { FileList } from "./FileList"
import { ButtonFile } from "../../components/Button/ButtonFile"
import { HashTest } from "../../components/Testing/HashTest"
import { processZipSandbox } from "../../utils/sandbox"
import { SandboxPreview } from "../../components/Artwork/SandboxPreview"
import { SandboxFiles } from "../../types/Sandbox"
import { generateFxHash } from "../../utils/hash"
import { RawFeatures } from "../../components/Features/RawFeatures"
import { ArtworkFrame } from "../../components/Artwork/ArtworkFrame"
import { ControlsTest } from "components/Testing/ControlsTest"
import { MinterTest } from "components/Testing/MinterTest"
import {
  TRuntimeContextConnector,
  useRuntimeController,
} from "hooks/useRuntimeController"
import { urlAddTokenParams } from "utils/ipfs"

export function Sandbox() {
  const artworkIframeRef = useRef<ArtworkIframeRef>(null)

  const [file, setFile] = useState<File | null>(null)
  const [filesRecord, setFilesRecord] = useState<SandboxFiles | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [url, setUrl] = useState<string | null>(null)

  // stores the sandbox state
  const [sandboxId, setSandboxId] = useState("0")
  const lastUrl = useRef("")
  const lastId = useRef(sandboxId)

  // the sandbox connector is used to give a particular control of the sandbow
  // iframe to the runtime controller. Because the sandbox is an edge case we
  // need such a module to fine-tune how the sandbox iframe behaves
  const sandboxConnector = useMemo<TRuntimeContextConnector>(
    () => (iframeRef) => {
      return {
        getUrl(state) {
          return urlAddTokenParams(
            `${location.origin}/sandbox/preview.html?id=${sandboxId}`,
            sandboxId === "0" ? generateFxHash() : state.hash || "",
            state.minter || "",
            state.inputBytes
          )
        },
        useSync(runtimeUrl: string, controlsUrl: string) {
          // every time the runtime URL changes, refresh the iframe
          useEffect(() => {
            if (sandboxId === "0") return
            const iframe = iframeRef.current?.getHtmlIframe()
            if (iframe && lastUrl.current !== runtimeUrl) {
              iframe.contentWindow?.location.replace(runtimeUrl)
              lastUrl.current = runtimeUrl
              lastId.current = sandboxId
            }
          }, [runtimeUrl, sandboxId])
        },
      }
    },
    [sandboxId]
  )

  const { runtime, controls } = useRuntimeController(
    artworkIframeRef,
    {
      cid: "", // in this case the url is constructed with the connector above
    },
    {
      contextConnector: sandboxConnector,
    }
  )

  const fileList = useMemo<string[] | null>(
    () => (filesRecord ? Object.keys(filesRecord) : null),
    [filesRecord]
  )

  const processFile = async (file: File) => {
    try {
      const record = await processZipSandbox(file)
      setFilesRecord(record)
    } catch (err) {
      // todo: process error
      console.error(err)
    }
  }

  const uploadFile = async () => {
    if (file) {
      processFile(file)
      /**
       * !HACK
       * For some reason I couldn't find a way to have the iframe location
       * replaced with th econnector above... tried everything I could think of.
       * With this "hack", it forces a refresh of the iframe
       */
      setTimeout(() => {
        runtime.state.update({ hash: generateFxHash() })
      }, 100)
    }
  }

  const updateFile = async (file: File | null) => {
    if (file) {
      setFile(file)
      processFile(file)
    }
  }

  return (
    <section
      className={cs(style.container, {
        [style["artwork-view"]]: !!filesRecord,
      })}
    >
      <div>
        {error && (
          <>
            <div className={cs(style.error)}>
              <i aria-hidden className="fas fa-exclamation-triangle" />
              <span>
                <strong>An error occurred when uploading your project</strong>
                <p>{error}</p>
              </span>
            </div>
            <Spacing size="regular" />
          </>
        )}

        {filesRecord ? (
          <div className={cs(style.testing)}>
            <div className={cs(style["files-header"])}>
              <h5>Files</h5>
              <span>
                <i aria-hidden className="fas fa-file-archive" /> {file?.name}
              </span>
            </div>
            <Spacing size="3x-small" />
            <FileList files={fileList} />
            <Spacing size="2x-small" />
            <ButtonFile
              state={"default"}
              accepted={["application/zip", "application/x-zip-compressed"]}
              onFile={updateFile}
              size="small"
              style={{
                alignSelf: "flex-start",
              }}
            >
              update .zip
            </ButtonFile>

            <Spacing size="2x-large" />

            <div>
              <h5>Testing</h5>
              <p>You need to verify that:</p>
              <ul>
                <li>
                  a same hash will <strong>always</strong> generate the same
                  output
                </li>
                <li>
                  different hashes generate <strong>different</strong> outputs
                </li>
              </ul>

              <HashTest
                autoGenerate={false}
                value={runtime.state.hash}
                onHashUpdate={(hash) => runtime.state.update({ hash })}
                onRetry={controls.refresh}
              />

              <Spacing size="large" />

              <MinterTest
                autoGenerate={false}
                value={runtime.state.minter}
                onMinterUpdate={(minter) => runtime.state.update({ minter })}
                onRetry={controls.refresh}
              />
            </div>
            {controls.state.params.definition && (
              <div>
                <Spacing size="2x-large" />
                <h5>Params</h5>
                <Spacing size="small" />
                <ControlsTest
                  params={controls.state.params.values}
                  definition={controls.state.params.definition}
                  onSubmit={controls.hardSync}
                  updateParams={controls.updateParams}
                />
              </div>
            )}
            <Spacing size="2x-large" />
            <div>
              <h5>Features</h5>
              <Spacing size="small" />
              <RawFeatures rawFeatures={runtime.definition.features} />
            </div>
            <Spacing size="2x-large" />
          </div>
        ) : (
          <div className={cs(style["drag-container"])}>
            <Dropzone
              className={cs(style.drag)}
              textDefault="Drag 'n' drop your ZIP file here"
              accepted={["application/zip", "application/x-zip-compressed"]}
              onChange={(files: File[] | null) => {
                setFile(files && files.length > 0 ? files[0] : null)
              }}
              files={file ? [file] : null}
            />
            <Button
              color="primary"
              state={"default"}
              className={style.button}
              disabled={!file}
              onClick={() => uploadFile()}
            >
              start tests
            </Button>
          </div>
        )}
      </div>
      <div className={cs(style.artworkWrapper)}>
        <div className={cs(style.artwork)}>
          <div className={cs(style["iframe-container"])}>
            <div className={cs(style["iframe-wrapper"])}>
              <ArtworkFrame>
                <SandboxPreview
                  id={sandboxId}
                  setId={setSandboxId}
                  ref={artworkIframeRef}
                  record={filesRecord || undefined}
                  textWaiting="Waiting for content to be reachable"
                  onUrlUpdate={setUrl}
                />
              </ArtworkFrame>
            </div>
          </div>

          {url && (
            <Button
              isLink
              // @ts-ignore
              href={url}
              target="_blank"
              size="small"
              className={style.button}
              iconComp={<i aria-hidden className="fas fa-external-link-alt" />}
              iconSide="right"
            >
              open live
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
