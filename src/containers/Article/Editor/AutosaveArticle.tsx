import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import style from "./AutosaveArticle.module.scss";
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
}
const _AutosaveArticle = ({ id, formValues, hasUnsavedMedias }: AutosaveArticleProps) => {
  const { state, dispatch } = useContext(ArticlesContext);
  const [status, setStatus] = useState<'unsaved'|'saving'|'saved'>('saved');

  const handleSaveDraft = useCallback((articleFormState: NFTArticleForm) => {
    setStatus('saving');
    dispatch({
      type: 'save',
      payload: { id, articleForm: articleFormState }
    })
    setStatus('saved');
  }, [dispatch, id])
  const debouncedSave = useMemo<typeof handleSaveDraft>(() => debounce(handleSaveDraft, 800), [handleSaveDraft]);
  const savedArticle = state.articles[id];
  useEffect(() => {
    const serializedSavedArticle = savedArticle && JSON.stringify(savedArticle.form);
    const serializedUnsavedArticle = formValues && JSON.stringify(formValues);
    if (serializedSavedArticle !== serializedUnsavedArticle) {
      setStatus('unsaved');
      debouncedSave(formValues);
    }
  }, [debouncedSave, formValues, savedArticle])
  const savedAt = savedArticle?.lastSavedAt && formatRelative(new Date(savedArticle.lastSavedAt), new Date());
  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        {status === 'saving' ?
          <>
            <LoaderBlock
              size="small"
              height="20px"
            />
            <span className={style.text}>
              saving...
            </span>
          </>
          :
          <>
            {status === 'saved' && !hasUnsavedMedias && <i className={cs("fa-solid fa-check", style.icon)} />}
            {hasUnsavedMedias && <span>{'[MEDIAS UNSAVED]'}</span>}
            {status === 'unsaved' && <span>{'[CHANGES UNSAVED]'}</span>}
            {savedAt &&
              <span className={style.text}>
                saved {savedAt}
              </span>
            }
          </>
        }
      </div>
    </div>
  );
};

export const AutosaveArticle = memo(_AutosaveArticle);
