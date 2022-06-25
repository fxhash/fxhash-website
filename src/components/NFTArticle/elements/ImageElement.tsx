import { PropsWithChildren, useMemo, useState } from "react"
import ReactTextareaAutosize from "react-textarea-autosize"
import { Transforms } from "slate"
import { ReactEditor, useFocused, useSelected, useSlateStatic } from "slate-react"
import style from "./ImageElement.module.scss"
import cs from "classnames"
import { BlockParamsModal } from "../SlateEditor/Utils/BlockParamsModal"
import { ImageAttributeSettings } from "../SlateEditor/Elements/AttributeSettings/ImageAttributeSettings"


interface Props {
  attributes: any
  element: any
}
export function ImageElement({
  attributes,
  element,
  children,
}: PropsWithChildren<Props>) {
  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, element)

  const [showAddImage, setShowAddImage] = useState<boolean>(false)

  // todo: handle IPFS
  const url = useMemo(
    () => element.url,
    [element.url]
  )
  const hasUrl = url !== ""

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
            <img src={url} alt="thumbnail image"/>
          ):(
            <button
              type="button"
              className={cs(style.import_image)}
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