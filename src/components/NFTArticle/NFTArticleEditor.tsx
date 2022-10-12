import style from "./NFTArticleEditor.module.scss"
import styleArticle from "./NFTArticle.module.scss"
import stylePageArticle from "../../containers/Article/PageArticle.module.scss"
import { SlateEditor } from "./SlateEditor/index"
import { Descendant } from "slate"
import { IEditorMediaFile } from "../../types/ArticleEditor/Image"
import { FxEditor } from "../../types/ArticleEditor/Editor"
import useInit from "../../hooks/useInit"
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { LoaderBlock } from "../Layout/LoaderBlock"
import { Debounce, debounce } from "../../utils/debounce"
import { NftArticle } from "./NFTArticle"
import cs from "classnames"
import { getMarkdownMedias } from "./SlateEditor/Plugins/SlateMediaPlugin"
import { MarkdownEditor } from "./MarkdownEditor/MarkdownEditor"

const editorDefaultValue = [
  {
    type: "paragraph",
    children: [
      {
        text: "",
      },
    ],
  },
]

type View = "wysiwyg" | "markdown" | "markdownWithPreview"

const views: Record<View, string> = {
  wysiwyg: "WYSIWYG",
  markdown: "Markdown",
  markdownWithPreview: "Markdown + Preview",
}

export interface RefNFTArticleEditor {
  updateMediaUrl: (target: IEditorMediaFile, uri: string) => void
}

interface NFTArticleEditorProps {
  placeholder?: string
  valueMarkdown: string | null
  onMediasUpdate: (medias: IEditorMediaFile[]) => void
  onChange: (md: string) => void
  onSlateEditorInit?: (editor: FxEditor) => void
  onMarkdownEditorInit?: (markdown: string) => void
}

const NftArticleEditor = forwardRef<RefNFTArticleEditor, NFTArticleEditorProps>(
  (
    {
      valueMarkdown,
      placeholder,
      onMediasUpdate,
      onChange,
      onSlateEditorInit,
      onMarkdownEditorInit,
    }: NFTArticleEditorProps,
    ref
  ) => {
    const refTopMarker = useRef<HTMLDivElement>(null)
    const refSlateEditor = useRef<FxEditor>(null)
    const [view, setView] = useState<View>("wysiwyg")
    const [initialValueSlate, setInitialValueSlate] = useState<
      Descendant[] | null
    >(null)

    const handleTransformMdToSlate = useCallback(async (mdValue) => {
      const getSlateEditorStateFromMarkdown = (await import("./processor"))
        .getSlateEditorStateFromMarkdown
      const editorFromMd = mdValue
        ? await getSlateEditorStateFromMarkdown(mdValue)
        : null
      setInitialValueSlate(
        editorFromMd ? editorFromMd.editorState : editorDefaultValue
      )
    }, [])
    const handleChangeSlate = useCallback(
      async (nodes: Descendant[]) => {
        const getMarkdownFromSlateEditorState = (await import("./processor"))
          .getMarkdownFromSlateEditorState
        const markdown = await getMarkdownFromSlateEditorState(nodes)
        onChange(markdown || "")
      },
      [onChange]
    )
    const handleToggleView = useCallback(
      (view: View) => async () => {
        if (view === "wysiwyg") {
          await handleTransformMdToSlate(valueMarkdown)
        }
        const rectObj = refTopMarker.current?.getBoundingClientRect()
        if (rectObj && rectObj.y < 0) {
          refTopMarker.current?.scrollIntoView()
        }
        setView(view)
      },
      [handleTransformMdToSlate, valueMarkdown]
    )

    const handleUpdateMediaUrl = useCallback(
      (target: IEditorMediaFile, uri: string) => {
        if (view === "wysiwyg") {
          refSlateEditor.current?.updateMediaUrl(target, uri)
        } else if (view === "markdown" || view === "markdownWithPreview") {
          if (valueMarkdown) {
            const newMd = valueMarkdown?.replaceAll(target.uri, uri)
            if (newMd !== valueMarkdown) {
              onChange(newMd)
              onMediasUpdate(getMarkdownMedias(newMd))
            }
          }
        }
      },
      [onChange, onMediasUpdate, valueMarkdown, view]
    )

    const handleUpdateMarkdownMedias = useCallback(
      (ev) => {
        onMediasUpdate(getMarkdownMedias(ev.target.value))
      },
      [onMediasUpdate]
    )
    const debouncedUpdateMarkdownMedias = useMemo<
      Debounce<typeof handleUpdateMarkdownMedias>
    >(
      () => debounce(handleUpdateMarkdownMedias, 2000),
      [handleUpdateMarkdownMedias]
    )

    const handleChangeMarkdown = useCallback(
      (ev) => {
        onChange(ev.target.value)
        debouncedUpdateMarkdownMedias(ev)
      },
      [debouncedUpdateMarkdownMedias, onChange]
    )
    const handleBlurMarkdown = useCallback(
      (ev) => {
        debouncedUpdateMarkdownMedias.cancel()
        handleUpdateMarkdownMedias(ev)
      },
      [debouncedUpdateMarkdownMedias, handleUpdateMarkdownMedias]
    )

    useImperativeHandle(
      ref,
      () => ({
        updateMediaUrl: handleUpdateMediaUrl,
      }),
      [handleUpdateMediaUrl]
    )
    useInit(async () => {
      await handleTransformMdToSlate(valueMarkdown)
    })
    const debouncedChangeBody = useMemo(
      () => debounce(handleChangeSlate, 800),
      [handleChangeSlate]
    )
    return (
      <>
        {initialValueSlate ? (
          <div>
            <div ref={refTopMarker} />
            <div className={style.toolbar}>
              <div className={style.container_view}>
                {Object.entries(views).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={handleToggleView(key as View)}
                    className={cs({
                      [style.view_active]: key === view,
                    })}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {view === "wysiwyg" && (
              <div className={styleArticle.article_wrapper}>
                <SlateEditor
                  ref={refSlateEditor}
                  placeholder={placeholder}
                  initialValue={initialValueSlate}
                  onMediasUpdate={onMediasUpdate}
                  onChange={debouncedChangeBody}
                  onInit={onSlateEditorInit}
                />
              </div>
            )}
            <div
              className={cs(style.container_markdown, {
                [style.container_centered]: view === "markdown",
              })}
            >
              {(view === "markdown" || view === "markdownWithPreview") && (
                <div className={style.container_markdown_child}>
                  <MarkdownEditor
                    className={style.textarea_markdown}
                    placeholder={placeholder}
                    value={valueMarkdown || ""}
                    onChange={handleChangeMarkdown}
                    onBlur={handleBlurMarkdown}
                    onInit={onMarkdownEditorInit}
                  />
                </div>
              )}
              {view === "markdownWithPreview" && (
                <div className={style.container_preview_child}>
                  <div
                    className={cs(
                      style.container_preview,
                      stylePageArticle.body
                    )}
                  >
                    <NftArticle markdown={valueMarkdown || ""} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <LoaderBlock size="small" height="20px" />
        )}
      </>
    )
  }
)
NftArticleEditor.displayName = "NftArticleEditor"
export default NftArticleEditor
