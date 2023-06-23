import cs from "classnames"
import style from "./AudioAttributeSettings.module.scss"
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
const acceptedAudioFiles = [
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
  "audio/flac",
]

export const AudioAttributeSettings: TEditAttributeComp = ({ onEdit }) => {
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
  const handleChangeUrlAudio = useCallback(
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
                accepted={acceptedAudioFiles}
                className={cs(style.dropzone)}
                maxSizeMb={30}
                textDefault={
                  <div className={cs(style.dropzone__content)}>
                    <i className="fa-solid fa-music" aria-hidden />
                    <span>Import an audio file (30mb max)</span>
                  </div>
                }
                textDrag={
                  <div className={cs(style.dropzone__content)}>
                    <span>Drop audio file</span>
                  </div>
                }
              />
            ) : tabIndex === 1 ? (
              <div className={cs(style.link_content)}>
                <Field className={cs(style.field)}>
                  <label>URL to audio</label>
                  <InputText
                    type="text"
                    value={textUrl}
                    onChange={handleChangeUrlAudio}
                    placeholder="https://audio.com/audio.mp3"
                  />
                </Field>

                <Submit>
                  <Button
                    size="small"
                    color="secondary"
                    disabled={textUrl.length === 0}
                    onClick={handleImportVideoFromUrl}
                  >
                    import audio
                  </Button>
                </Submit>
              </div>
            ) : null}
          </div>
        )}
      </TabsContainer>
      <div>Supported formats: .mp3, .ogg or .wav</div>
    </div>
  )
}
