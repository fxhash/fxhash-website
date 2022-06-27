import style from "./ArticleEditor.module.scss"
import articleStyle from "../../../components/NFTArticle/NFTArticle.module.scss"
import cs from "classnames"
import TextareaAutosize from "react-textarea-autosize"
import { useCallback, useMemo, useRef, useState } from "react"
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
import { IEditorMediaFile } from "../../../types/ArticleEditor/Image"
import { FxEditor } from "../../../types/ArticleEditor/Editor"
import { EditorMedias } from "./EditorMedias"
import { ImagePolymorphic } from "../../../components/Medias/ImagePolymorphic"
import { arrayRemoveDuplicates } from "../../../utils/array"

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
  thumbnailCaption: string
  abstract: string
  editions: string
  royalties: string
  royaltiesSplit: ISplit[]
}

const initialValues: IInput = {
  title: "",
  thumbnailCaption: "",
  abstract: "",
  editions: "",
  royalties: "",
  royaltiesSplit: []
}

interface Props {
}
export function ArticleEditor({
}: Props) {
  const editorStateRef = useRef<FxEditor>(null)

  const handleClick = async () => {
    const markdown = await getMarkdownFromSlateEditorState(editorStateRef.current!.children)
    console.log(markdown)
  }

  const [thumbnail, setThumbnail] = useState<string|null>(null)

  // update the thumbnail by creating a local URL from a given file
  const updateThumbnail = useCallback((file: File|null) => {
    setThumbnail(
      file ? URL.createObjectURL(file) : null
    )
  }, [])

  // keeps track of the medias added in editor (and their local/uploaded vers)
  const [medias, setMedias] = useState<IEditorMediaFile[]>([])

  // add the thumbnail to the list of medias
  const mediasWithThumbnail = useMemo(
    () => thumbnail ? 
      arrayRemoveDuplicates([
        {
          uri: thumbnail,
          type: "image"
        } as IEditorMediaFile,
        ...medias
      ],
      (a, b) => a.uri === b.uri
      ) : medias,
    [thumbnail, medias]
  )

  // when a media uri is updated (via IPFS upload)
  const onMediaUriUpdate = useCallback((target: IEditorMediaFile, uri: string) => {
    // should the thumbnail be updated ?
    if (thumbnail === target.uri) {
      setThumbnail(uri)
    }
    // update the medias in the editor
    editorStateRef.current?.updateMediaUrl(
      target,
      uri
    )
  }, [])

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
              [style.image_loaded]: !!thumbnail
            })}
            onChange={(files) => updateThumbnail(files?.[0] || null)}
            textDefault={
              thumbnail ? (
                <ImagePolymorphic
                  uri={thumbnail}
                />
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
              thumbnail ? (
                <ImagePolymorphic
                  uri={thumbnail}
                />
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
          <TextareaAutosize
            value={values.thumbnailCaption}
            onChange={evt => setFieldValue("thumbnailCaption", evt.target.value)}
            className={cs(style.input_caption)}
            minRows={1}
            placeholder="Thumbnail caption..."
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
              onMediasUpdate={setMedias}
            />
          </div>

          <Spacing size="6x-large"/>

          <div className={cs(style.sep)}/>

          <Spacing size="6x-large"/>

          <div className={cs(style.w900)}>
            <Field>
              <label>
                Medias ({mediasWithThumbnail.length})
                <small>Before the article can be published, all the medias within the article must be uploaded to IPFS</small>
              </label>
              <EditorMedias
                medias={mediasWithThumbnail}
                onMediaUriUpdate={onMediaUriUpdate}
              />
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