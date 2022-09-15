import { memo, NamedExoticComponent, PropsWithChildren, useCallback, useState } from "react"
import { Transforms } from "slate"
import { ReactEditor, useSlateStatic } from "slate-react"
import style from "./VideoEditor.module.scss"
import editorStyle from "../../SlateEditor/UI/EditorStyles.module.scss"
import cs from "classnames"
import { BlockParamsModal } from "../../SlateEditor/UI/BlockParamsModal";
import { VideoAttributeSettings } from "./VideoAttributeSettings";
import { VideoPolymorphic } from "../../../Medias/VideoPolymorphic";

interface VideoElementProps {
  attributes?: any
  element?: any
  src?: string,
}
export const VideoEditor: NamedExoticComponent<PropsWithChildren<VideoElementProps>> = memo(({
  attributes,
  element,
  children,
}) => {
  const [showAddVideo, setShowAddVideo] = useState<boolean>(false)
  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, element)

  const handleShowAddVideo = useCallback((event) => {
    event.preventDefault()
    event.stopPropagation()
    setShowAddVideo(true);
  }, [])
  const handleCloseAddVideo = useCallback(() => setShowAddVideo(false), []);
  const handleAddVideo = useCallback((element) => {
    Transforms.setNodes(editor, { src: element.src }, {
      at: path
    })
    setShowAddVideo(false);
  }, [editor, path])

  const hasUrl = element.src !== ""

  return (
    <>
      <div {...attributes}>
        {children}
        <div contentEditable={false}>
          {hasUrl ? (
            <VideoPolymorphic
              controls
              uri={element.src}
              className={style.video}
            />
          ):(
            <button
              type="button"
              className={cs(editorStyle.import_btn)}
              onClick={handleShowAddVideo}
            >
              <i className="fa-solid fa-video" aria-hidden/>
              <span>
                Add a video
              </span>
            </button>
          )}
        </div>
      </div>
      {showAddVideo && (
        <BlockParamsModal
          onClose={handleCloseAddVideo}
        >
          <VideoAttributeSettings
            element={element}
            onEdit={handleAddVideo}
          />
        </BlockParamsModal>
      )}
    </>
  )
});

VideoEditor.displayName = 'VideoElement';
