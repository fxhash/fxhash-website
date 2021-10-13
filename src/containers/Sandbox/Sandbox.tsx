import style from "./Sandbox.module.scss"
import cs from "classnames"
import { ArtworkIframe } from "../../components/Artwork/PreviewIframe"
import { Dropzone } from "../../components/Input/Dropzone"
import { useState } from "react"
import { Button } from "../../components/Button"

export function Sandbox() {
  const [file, setFile] = useState<File|null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <section className={cs(style.container)}>
      <div>
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
            // disabled={!file}
            onClick={() => {
              setLoading(true)
            }}
          >
            start tests 
          </Button>
        </div>
      </div>

      <div>
        <div className={cs(style['iframe-container'])}>
          <div className={cs(style['iframe-wrapper'])}>
            <ArtworkIframe url="thrthrth" />
          </div>
        </div>
      </div>
    </section>
  )
}