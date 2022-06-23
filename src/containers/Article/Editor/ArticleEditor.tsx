import style from "./ArticleEditor.module.scss"
import articleStyle from "../../../components/NFTArticle/NFTArticle.module.scss"
import cs from "classnames"
import TextareaAutosize from "react-textarea-autosize"
import { useMemo, useRef, useState } from "react"
import { Node } from "slate"
import { SlateEditor } from "../../../components/NFTArticle/SlateEditor"
import { Dropzone } from "../../../components/Input/Dropzone"
import { Spacing } from "../../../components/Layout/Spacing"
import { Field } from "../../../components/Form/Field"
import { ISplit } from "../../../types/entities/Split"
import { Formik } from "formik"
import { InputSplits } from "../../../components/Input/InputSplits"
import { transformSplitsSum1000 } from "../../../utils/transformers/splits"
import { Donations } from "../../Input/Donations"
import { Submit } from "../../../components/Form/Submit"
import { Button } from "../../../components/Button"
import { InputTextUnit } from "../../../components/Input/InputTextUnit"
import { getMarkdownFromSlateEditorState } from "../../../components/NFTArticle/processor"

const editorInitialValue = [
  {
    type: "paragraph",
    children: [{
      text: ""
    }]
  }
]

// todo: refacto, move out of there
interface IInput {
  title: string
  abstract: string
  editions: string
  royalties: string
  royaltiesSplit: ISplit[]
}

const initialValues: IInput = {
  title: "",
  abstract: "",
  editions: "",
  royalties: "",
  royaltiesSplit: []
}

interface Props {
}
export function ArticleEditor({
}: Props) {
  const editorStateRef = useRef<Node[]>(null)

  const handleClick = async () => {
    const markdown = await getMarkdownFromSlateEditorState(editorStateRef.current as Node[])
    console.log(markdown)
  }

  // TODO: move state to object
  const [thumbnail, setThumbnail] = useState<File|null>(null)
  const thumbnailUrl = useMemo(() => {
    console.log(thumbnail)
    if (!thumbnail) return null
    return URL.createObjectURL(thumbnail)
  }, [thumbnail])

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={validation}
      onSubmit={(values) => {
        console.log(values)
      }}
    >
      {({ values, handleChange, setFieldValue, handleBlur, handleSubmit, errors }) => (
        <>
          <div className={cs(style.section_title)}>
            <span>
              TITLE
            </span>
          </div>
          <TextareaAutosize
            value={values.title}
            onChange={evt => setFieldValue("title", evt.target.value)}
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
            value={values.abstract}
            onChange={evt => setFieldValue("abstract", evt.target.value)}
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

          <div className={cs(style.w900)}>
            <Field>
              <label>
                Medias
                <small>Before the article can be published, all the medias within the article must be uploaded to IPFS</small>
              </label>
              <div>HERE MEDIAS</div>
            </Field>
          
            <Field>
              <label htmlFor="editions">
                Number of editions
                <small>How many collectible fungible editions of the article</small>
              </label>
              <InputTextUnit
                unit=""
                type="text"
                name="editions"
                value={values.editions}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.editions}
              />
            </Field>

            <Field>
              <label htmlFor="royalties">
                Royalties
                <small>Between 0% and 25%</small>
              </label>
              <InputTextUnit
                unit="%"
                type="text"
                name="royalties"
                value={values.royalties}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.royalties}
              />
            </Field>

            <Field
              error={typeof errors.royaltiesSplit === "string" 
                ? errors.royaltiesSplit
                : undefined
              }
            >
              <label>
                Royalties Splits
                <small>
                  You can also split the proceeds on the secondary (royalties will be divided between the addresses)
                </small>
              </label>
              <InputSplits
                value={values.royaltiesSplit}
                onChange={splits => setFieldValue("royaltiesSplit", splits)}
                sharesTransformer={transformSplitsSum1000}
                textShares="Shares (out of 1000)"
                errors={errors.royaltiesSplit as any}
              >
                {(({ addAddress }) => (
                  <div className={cs(style.royalties_last_row)}>
                    <Donations
                      onClickDonation={addAddress}
                    />
                  </div>
                ))}
              </InputSplits>
            </Field>

            <Spacing size="3x-large"/>

            <Submit layout="center">
              <Button
                type="button"
                size="large"
                color="secondary"
                onClick={() => handleClick()}
              >
                preview &amp; mint
              </Button>
            </Submit>
          </div>
        </>
      )}
    </Formik>
  )
}