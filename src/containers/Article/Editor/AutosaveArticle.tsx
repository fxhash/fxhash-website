import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import style from "./AutosaveArticle.module.scss";
import effects from "../../../styles/Effects.module.scss"
import text from "../../../styles/Colors.module.css"
import { LoaderBlock } from "../../../components/Layout/LoaderBlock";
import cs from "classnames";
import { ArticlesContext } from "../../../context/Articles";
import { debounce } from "../../../utils/debounce";
import { NFTArticleForm } from "../../../types/ArticleEditor/Editor";
import { formatRelative } from "date-fns";

interface AutosaveArticleProps {
  id: string,
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
  const { state, dispatch } = useContext(ArticlesContext);
  const [status, setStatus] = useState<'unsaved'|'saving'|'saved'>('saved');

  const handleSaveDraft = useCallback((articleFormState: NFTArticleForm) => {
    setStatus('saving');
    dispatch({
      type: 'save',
      payload: { 
        id,
        articleForm: articleFormState,
        minted: isMinted,
      },
    })
    setStatus('saved');
  }, [dispatch, id])

  const debouncedSave = useMemo<typeof handleSaveDraft>(
    () => debounce(handleSaveDraft, 800),
    [handleSaveDraft]
  );
  const savedArticle = state.articles[id];

  useEffect(() => {
    const serializedSavedArticle = savedArticle && JSON.stringify(savedArticle.form);
    const serializedUnsavedArticle = formValues && JSON.stringify(formValues);
    if (serializedSavedArticle !== serializedUnsavedArticle) {
      setStatus('unsaved');
      debouncedSave(formValues);
    }
  }, [debouncedSave, formValues, savedArticle])

  return (
    <div className={cs(style.root, effects['drop-shadow-small'])}>
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
      {status === "saving" || status === "unsaved" ? (
        <>
          <LoaderBlock
            size="tiny"
            height="20px"
            className={cs(style.loader)}
          />
          <span className={style.text}>
            saving document
          </span>
        </>
      ):(
        <>
          <i className="fa-solid fa-circle-check" aria-hidden />
          <span className={style.text}>
            document saved
          </span>
        </>
      )}
    </div>
  );
};

export const AutosaveArticle = memo(_AutosaveArticle);
