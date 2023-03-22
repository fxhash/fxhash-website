import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
// import { detectIncognito } from "detect-incognito";
import style from "./AutosaveArticle.module.scss"
import effects from "../../../styles/Effects.module.scss"
import text from "../../../styles/Colors.module.css"
import { LoaderBlock } from "../../../components/Layout/LoaderBlock"
import cs from "classnames"
import { ArticlesContext, loadLocalArticle } from "../../../context/Articles"
import { debounce } from "../../../utils/debounce"
import { NFTArticleForm } from "../../../types/ArticleEditor/Editor"
import { hasLocalStorage } from "../../../utils/window"

type SaveStatus = "unsaved" | "saving" | "saved" | "failed"
type SaveAbility = "init" | "privateNavigation" | "noLocalStorage" | "working"
interface AutosaveArticleProps {
  id: string
  formValues: NFTArticleForm
  hasUnsavedMedias?: boolean
  onMediasUnsavedClick: () => void
  isMinted: boolean
}
const _AutosaveArticle = ({
  id,
  formValues,
  hasUnsavedMedias,
  onMediasUnsavedClick,
  isMinted,
}: AutosaveArticleProps) => {
  const { state, dispatch } = useContext(ArticlesContext)
  const [status, setStatus] = useState<SaveStatus>("saved")
  const [saveAbility, setSaveAbility] = useState<SaveAbility>("init")

  const handleSaveDraft = useCallback(
    (articleFormState: NFTArticleForm) => {
      setStatus("saving")
      dispatch({
        type: "save",
        payload: {
          id,
          articleForm: articleFormState,
          minted: isMinted,
        },
      })
      const article = loadLocalArticle(id)
      if (JSON.stringify(article.form) !== JSON.stringify(articleFormState)) {
        setStatus("failed")
      } else {
        setStatus("saved")
      }
    },
    [dispatch, id, isMinted]
  )

  const debouncedSave = useMemo<typeof handleSaveDraft>(
    () => debounce(handleSaveDraft, 800),
    [handleSaveDraft]
  )
  const savedArticle = state.articles[id]

  useEffect(() => {
    const canSaveInLocalStorage = async () => {
      // try {
      //   const { isPrivate } = await detectIncognito();
      //   if (isPrivate) {
      //     return setSaveAbility('privateNavigation');
      //   }
      // } catch (e) {
      //   console.error(e);
      // }
      if (!hasLocalStorage()) {
        return setSaveAbility("noLocalStorage")
      }
      return setSaveAbility("working")
    }
    canSaveInLocalStorage()
  }, [])
  useEffect(() => {
    if (saveAbility !== "working") return
    const serializedSavedArticle =
      savedArticle && JSON.stringify(savedArticle.form)
    const serializedUnsavedArticle = formValues && JSON.stringify(formValues)
    if (serializedSavedArticle !== serializedUnsavedArticle) {
      setStatus("unsaved")
      debouncedSave(formValues)
    }
  }, [saveAbility, debouncedSave, formValues, savedArticle])
  if (saveAbility === "init") return null
  return (
    <div className={cs(style.root, effects["drop-shadow-small"])}>
      {saveAbility === "working" ? (
        <>
          {hasUnsavedMedias && (
            <button
              type="button"
              className={cs(text.error, style.medias_unsaved)}
              onClick={onMediasUnsavedClick}
            >
              <i className="fa-solid fa-circle-xmark" aria-hidden />
              <span>medias not uploaded</span>
            </button>
          )}
          {status === "failed" && (
            <span className={cs(text.error, style.error)}>
              <i className="fa-solid fa-circle-xmark" aria-hidden />
              <span className={cs(style.text, text.error)}>failed to save</span>
            </span>
          )}
          {(status === "saving" || status === "unsaved") && (
            <>
              <LoaderBlock
                size="tiny"
                height="20px"
                className={cs(style.loader)}
              />
              <span className={style.text}>saving document</span>
            </>
          )}
          {status === "saved" && (
            <>
              <i className="fa-solid fa-circle-check" aria-hidden />
              <span className={style.text}>document saved</span>
            </>
          )}
        </>
      ) : (
        <span className={cs(text.error, style.error)}>
          <i className="fa-solid fa-circle-xmark" aria-hidden />
          {saveAbility === "privateNavigation" && (
            <span>You can&apos;t use autosave with private navigation</span>
          )}
          {saveAbility === "noLocalStorage" && (
            <span>
              You can&apos;t use autosave. Your browser can&apos;t use local
              storage{" "}
            </span>
          )}
        </span>
      )}
    </div>
  )
}

export const AutosaveArticle = memo(_AutosaveArticle)
