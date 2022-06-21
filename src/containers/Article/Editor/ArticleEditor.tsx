import style from "./ArticleEditor.module.scss"
import articleStyle from "../../../components/NFTArticle/NFTArticle.module.scss"
import cs from "classnames"
import TextareaAutosize from "react-textarea-autosize"
import { useMemo, useRef, useState } from "react";
import { Node } from "slate";
import { SlateEditor } from "../../../components/NFTArticle/SlateEditor";
import { Dropzone } from "../../../components/Input/Dropzone";
import { Spacing } from "../../../components/Layout/Spacing";

const editorInitialValue = [
  {
    type: "paragraph",
    children: [{
      text: ""
    }]
  }
]

interface Props {
}
export function ArticleEditor({
}: Props) {
  const editorStateRef = useRef<Node[]>(null)

  // TODO: move state to object
  const [thumbnail, setThumbnail] = useState<File|null>(null)
  const thumbnailUrl = useMemo(() => {
    console.log(thumbnail)
    if (!thumbnail) return null
    return URL.createObjectURL(thumbnail)
  }, [thumbnail])

  console.log(thumbnailUrl)

  return (
    <>
      <div className={cs(style.section_title)}>
        <span>
          TITLE
        </span>
      </div>
      <TextareaAutosize
        className={cs(style.input_title)}
        minRows={1}
        placeholder="Title of the article"
      />

      <div className={cs(style.section_title)}>
        <span>
          ABSTRACT
        </span>
      </div>
      <TextareaAutosize
        className={cs(style.input_abstract, style.w900)}
        minRows={1}
        placeholder="A short description (max 500 words) about the content of the article. The abstract is by default displayed at the top of the article on fxhash and is being used to introduce articles when space is limited."
      />

      <div className={cs(style.section_title)}>
        <span>
          THUMBNAIL
        </span>
      </div>

      <Dropzone
        className={cs(style.thumbnail_dropzone, {
          [style.image_loaded]: !!thumbnailUrl
        })}
        onChange={(files) => setThumbnail(files?.[0] || null)}
        textDefault={
          thumbnailUrl ? (
            <img src={thumbnailUrl} alt="thumbnail image"/>
          ):(
            <div className={cs(style.placeholder_wrapper)}>
              <i className="fa-solid fa-image" aria-hidden/>
              <span>
                Select a thumbnail
              </span>
            </div>
          )
        }
        textDrag={
          thumbnailUrl ? (
            <img src={thumbnailUrl} alt="thumbnail image"/>
          ):(
            <div className={cs(style.placeholder_wrapper)}>
              <i className="fa-solid fa-image" aria-hidden/>
              <span>
                Drop your image
              </span>
            </div>
          )
        }
        accepted={["image/jpeg", "image/png", "image/gif"]}
      />

      <div className={cs(style.section_title)}>
        <span>
          BODY
        </span>
      </div>
      
      <div className={cs(articleStyle.article_wrapper)}>
        <SlateEditor
          ref={editorStateRef}
          initialValue={editorInitialValue}
          placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ut magna eu sapien placerat auctor. Phasellus vel erat a mi cursus posuere nec et diam. Maecenas quis nisl ligula. Sed velit sapien, accumsan eget cursus sit amet, egestas sit amet odio. Cras vitae urna sodales, suscipit ipsum a, aliquam ex. Pellentesque ut placerat arcu, a fringilla ante. Sed varius sem mi, sed interdum nunc consectetur ut. Nulla consectetur diam purus, quis volutpat nunc ultrices eget. Nam vel consectetur lacus, vel auctor dolor."
        />
      </div>

      <Spacing size="6x-large"/>

      <div className={cs(style.sep)}/>

      <Spacing size="6x-large"/>

      <p>HERE OTHER INPUTS</p>
    </>
  )
}