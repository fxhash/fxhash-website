import { memo, NamedExoticComponent, PropsWithChildren, useCallback, useState } from "react"
import { Transforms } from "slate"
import { ReactEditor, useSlateStatic } from "slate-react"
import style from "./AudioEditor.module.scss";
import editorStyle from "../../SlateEditor/UI/EditorStyles.module.scss"
import cs from "classnames"
import { BlockParamsModal } from "../../SlateEditor/UI/BlockParamsModal";
import { AudioAttributeSettings } from "./AudioAttributeSettings";
import { AudioPolymorphic } from "../../../Medias/AudioPolymorphic";

interface AudioElementProps {
  attributes?: any
  element?: any
  src?: string,
}
export const AudioEditor: NamedExoticComponent<PropsWithChildren<AudioElementProps>> = memo(({
  attributes,
  element,
  children,
}) => {
  const [showAddAudio, setShowAddAudio] = useState<boolean>(false)
  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, element)

  const handleShowAddAudio = useCallback((event) => {
    event.preventDefault()
    event.stopPropagation()
    setShowAddAudio(true);
  }, [])
  const handleCloseAddAudio = useCallback(() => setShowAddAudio(false), []);
  const handleAddAudio = useCallback((element) => {
    Transforms.setNodes(editor, { src: element.src }, {
      at: path
    })
    setShowAddAudio(false);
  }, [editor, path])

  const hasUrl = element.src !== ""

  return (
    <>
      <div {...attributes}>
        {children}
        <div contentEditable={false}>
          {hasUrl ? (
            <AudioPolymorphic
              controls
              className={style.audio}
              uri={element.src}
            />
          ):(
            <button
              type="button"
              className={cs(editorStyle.import_btn)}
              onClick={handleShowAddAudio}
            >
              <i className="fa-solid fa-music" aria-hidden/>
              <span>
                Add an audio file
              </span>
            </button>
          )}
        </div>
      </div>
      {showAddAudio && (
        <BlockParamsModal
          onClose={handleCloseAddAudio}
        >
          <AudioAttributeSettings
            element={element}
            onEdit={handleAddAudio}
          />
        </BlockParamsModal>
      )}
    </>
  )
});

AudioEditor.displayName = 'AudioEditor';
