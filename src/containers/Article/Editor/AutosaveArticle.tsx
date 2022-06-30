import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import style from "./AutosaveArticle.module.scss";
import { LoaderBlock } from "../../../components/Layout/LoaderBlock";
import cs from "classnames";
import { useFormikContext } from "formik";
import { ArticlesContext } from "../../../context/Articles";
import { debounce } from "../../../utils/debounce";
import { NFTArticleForm } from "../../../types/ArticleEditor/Editor";
import { formatDistance } from "date-fns";

interface AutosaveArticleProps {
  id: string,
}
const _AutosaveArticle = ({ id }: AutosaveArticleProps) => {
  const formik = useFormikContext<NFTArticleForm>();
  const { state, dispatch } = useContext(ArticlesContext);
  const [status, setStatus] = useState<'unsaved'|'saving'|'saved'>('saved');

  const handleSaveDraft = useCallback((articleFormState) => {
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
    const serializedUnsavedArticle = savedArticle && JSON.stringify(formik.values);
    if (serializedSavedArticle !== serializedUnsavedArticle) {
      setStatus('unsaved');
      debouncedSave(formik.values);
    }
  }, [debouncedSave, formik.values, savedArticle])
  const savedAt = savedArticle?.lastSavedAt && formatDistance(new Date(savedArticle.lastSavedAt), new Date(),
    { addSuffix: true });
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
            {status === 'saved' && <i className={cs("fa-solid fa-check", style.icon)} /> }
            {status === 'unsaved' && <span>{'[CHANGES UNSAVED]'}</span>}
            {savedAt &&
              <span className={style.text}>
                last saved {savedAt}
              </span>
            }
          </>
        }
      </div>
    </div>
  );
};

export const AutosaveArticle = memo(_AutosaveArticle);
