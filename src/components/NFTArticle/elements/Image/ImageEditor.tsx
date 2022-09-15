import { PropsWithChildren, useState } from "react"
import { Transforms } from "slate"
import { ReactEditor, useSlateStatic } from "slate-react"
import editorStyle from "../../SlateEditor/UI/EditorStyles.module.scss"
import cs from "classnames"
import { BlockParamsModal } from "../../SlateEditor/UI/BlockParamsModal"
import { ImageAttributeSettings } from "./ImageAttributeSettings"
import { ImagePolymorphic } from "../../../Medias/ImagePolymorphic"

interface Props {
  attributes: any
  element: any
}
export function ImageEditor({
  attributes,
  element,
  children,
}: PropsWithChildren<Props>) {
  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, element)

  const [showAddImage, setShowAddImage] = useState<boolean>(false)

  const hasUrl = element.url !== ""

  const setImage = (element: any) => {
    Transforms.setNodes(editor, element, {
      at: path
    })
  }

  return (
    <>
      <div {...attributes}>
        {children}
        <div contentEditable={false}>
          {hasUrl ? (
            <ImagePolymorphic
              uri={element.url}
            />
          ):(
            <button
              type="button"
              className={cs(editorStyle.import_btn)}
              onClick={(event) => {
                setShowAddImage(true)
                event.preventDefault()
                event.stopPropagation()
              }}
            >
              <i className="fa-solid fa-image" aria-hidden/>
              <span>
                Add an image
              </span>
            </button>
          )}
        </div>
      </div>
      {showAddImage && (
        <BlockParamsModal
          onClose={() => setShowAddImage(false)}
        >
          <ImageAttributeSettings
            element={element}
            onEdit={element => {
              setImage(element)
              setShowAddImage(false)
            }}
          />
        </BlockParamsModal>
      )}
    </>
  )
}
