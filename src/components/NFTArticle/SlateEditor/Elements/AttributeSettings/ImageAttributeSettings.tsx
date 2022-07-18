import cs from "classnames"
import style from "./ImageAttributeSettings.module.scss"
import { Dropzone } from "../../../../Input/Dropzone"
import { TabDefinition } from "../../../../Layout/Tabs"
import { TabsContainer } from "../../../../Layout/TabsContainer"
import { TEditAttributeComp } from "../Blocks"
import { InputText } from "../../../../Input/InputText"
import { useState } from "react"
import { Field } from "../../../../Form/Field"
import { Submit } from "../../../../Form/Submit"
import { Button } from "../../../../Button"

const tabs: TabDefinition[] = [
  {
    name: "Upload"
  },
  {
    name: "External link"
  }
]

export const ImageAttributeSettings: TEditAttributeComp = ({
  element,
  onEdit,
}) => {
  const [textUrl, setTextUrl] = useState<string>("")

  const onAddFile = (file: File) => {
    if (file) {
      onEdit({
        url: URL.createObjectURL(file)
      })
    }
  }

  return (
    <TabsContainer
      tabsLayout="full-width"
      tabDefinitions={tabs}
      tabsClassName={style.tab}
    >
      {({ tabIndex }) => (
        <div className={cs(style.content)}>
          {tabIndex === 0 ? (
            <Dropzone
              onChange={files => files && files[0] && onAddFile(files[0])}
              accepted={["image/jpeg", "image/png", "image/gif"]}
              className={cs(style.dropzone)}
              textDefault={(
                <div className={cs(style.dropzone__content)}>
                  <i className="fa-solid fa-image" aria-hidden/>
                  <span>
                    Import an image
                  </span>
                </div>
              )}
              textDrag={(
                <div className={cs(style.dropzone__content)}>
                  <span>
                    Drop image file
                  </span>
                </div>
              )}
            />
          ):tabIndex === 1 ? (
            <form 
              className={cs(style.link_content)}
              onSubmit={(event) => {
                event.preventDefault()
                onEdit({
                  url: textUrl
                })
              }}
            >
              <Field className={cs(style.field)}>
                <label>URL to image</label>
                <InputText
                  type="text"
                  value={textUrl}
                  onChange={event => setTextUrl(event.target.value)}
                  placeholder="https://image.com/image.jpg"
                />
              </Field>

              <Submit>
                <Button
                  type="submit"
                  size="small"
                  color="secondary"
                  disabled={textUrl.length === 0}
                >
                  import image
                </Button>
              </Submit>
            </form>
          ):null}
        </div>
      )}
    </TabsContainer>
  )
}