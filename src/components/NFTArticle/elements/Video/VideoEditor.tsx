import { memo, PropsWithChildren, useCallback, useState } from "react"
import { Transforms } from "slate"
import { ReactEditor, useSlateStatic } from "slate-react"
import style from "./VideoEditor.module.scss"
import articleStyle from "../../NFTArticle.module.scss";
import editorStyle from "../../SlateEditor/Utils/EditorStyles.module.scss"
import cs from "classnames"
import { NFTArticleElementComponent } from "../../../../types/Article";
import { BlockParamsModal } from "../../SlateEditor/Utils/BlockParamsModal";
import { VideoAttributeSettings } from "./VideoAttributeSettings";
import { VideoPolymorphic } from "../../../Medias/VideoPolymorphic";

interface VideoElementProps {
  attributes?: any
  element?: any
  src?: string,
}
export const VideoEditor: NFTArticleElementComponent<PropsWithChildren<VideoElementProps>> = memo(({
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
VideoEditor.getPropsFromNode = (node, properties) => {
  return ({
    src: properties.src || '',
  })
}
