import cs from "classnames"
import style from "./VideoAttributeSettings.module.scss"
import { Dropzone } from "../../../Input/Dropzone"
import { TabDefinition } from "../../../Layout/Tabs"
import { TabsContainer } from "../../../Layout/TabsContainer"
import { useCallback, useState } from "react"
import { Field } from "../../../Form/Field"
import { InputText } from "../../../Input/InputText"
import { Submit } from "../../../Form/Submit"
import { Button } from "../../../Button"
import { TEditAttributeComp } from "../../../../types/ArticleEditor/BlockDefinition"

const tabs: TabDefinition[] = [
  {
    name: "Upload",
  },
  {
    name: "External link",
  },
]
const acceptedVideoFiles = ["video/mp4", "video/ogg", "video/webm"]

export const VideoAttributeSettings: TEditAttributeComp = ({ onEdit }) => {
  const [textUrl, setTextUrl] = useState<string>("")

  const handleAddFile = useCallback(
    (files) => {
      if (!files || !files[0]) return null
      const [file] = files
      if (file) {
        onEdit({
          src: URL.createObjectURL(file),
        })
      }
    },
    [onEdit]
  )
  const handleChangeUrlVideo = useCallback(
    (event) => setTextUrl(event.target.value),
    []
  )
  const handleImportVideoFromUrl = useCallback(
    (event) => {
      event.preventDefault()
      onEdit({
        src: textUrl,
      })
    },
    [onEdit, textUrl]
  )

  return (
    <div>
      <TabsContainer
        tabsLayout="full-width"
        tabDefinitions={tabs}
        tabsClassName={style.tab}
      >
        {({ tabIndex }) => (
          <div className={cs(style.content)}>
            {tabIndex === 0 ? (
              <Dropzone
                onChange={handleAddFile}
                accepted={acceptedVideoFiles}
                className={cs(style.dropzone)}
                maxSizeMb={50}
                textDefault={
                  <div className={cs(style.dropzone__content)}>
                    <i className="fa-solid fa-video" aria-hidden />
                    <span>Import a video (50mb max)</span>
                  </div>
                }
                textDrag={
                  <div className={cs(style.dropzone__content)}>
                    <span>Drop video file</span>
                  </div>
                }
              />
            ) : tabIndex === 1 ? (
              <div className={cs(style.link_content)}>
                <Field className={cs(style.field)}>
                  <label>URL to video</label>
                  <InputText
                    type="text"
                    value={textUrl}
                    onChange={handleChangeUrlVideo}
                    placeholder="https://video.com/video.mp4"
                  />
                </Field>

                <Submit>
                  <Button
                    size="small"
                    color="secondary"
                    disabled={textUrl.length === 0}
                    onClick={handleImportVideoFromUrl}
                  >
                    import video
                  </Button>
                </Submit>
              </div>
            ) : null}
          </div>
        )}
      </TabsContainer>
      <div>Supported formats: .mp4, .ogg or .webm</div>
    </div>
  )
}
