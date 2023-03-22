import layout from "../../../../../styles/Layout.module.scss"
import cs from "classnames"
import { NextPage } from "next"
import Head from "next/head"
import { ArticleEditor } from "../../../../../containers/Article/Editor/ArticleEditor"
import { Spacing } from "../../../../../components/Layout/Spacing"
import React, { useCallback, useContext, useState } from "react"
import { ArticlesContext } from "../../../../../context/Articles"
import { useRouter } from "next/router"
import { LoaderBlock } from "../../../../../components/Layout/LoaderBlock"
import { Error } from "../../../../../components/Error/Error"
import useInit from "../../../../../hooks/useInit"

const ArticleEditorPage: NextPage = () => {
  const [hasLoadUpToDate, setHasLoadUpToDate] = useState(false)
  const router = useRouter()
  const { state, dispatch } = useContext(ArticlesContext)
  const localId = typeof router.query.id === "string" ? router.query.id : null

  const handleSubmit = useCallback(
    (values) => {
      dispatch({
        type: "save",
        payload: { id: localId!, articleForm: values },
      })
      router.push(`/article/editor/local/${localId}/preview`)
    },
    [dispatch, localId, router]
  )
  useInit(() => {
    dispatch({ type: "loadAll" })
    setHasLoadUpToDate(true)
  })
  const article = localId ? state.articles[localId] : null
  return (
    <>
      <Head>
        <title>Draft {article && `- ${article.form.title}`}</title>
        <link href="/highlight/prism-dracula.css" rel="stylesheet" />
      </Head>

      <Spacing size="3x-large" />

      <main className={cs(layout["padding-small"])}>
        {hasLoadUpToDate && router.isReady ? (
          <>
            {localId && article ? (
              <ArticleEditor
                initialValues={article.form}
                hasLocalAutosave
                localId={localId}
                onSubmit={handleSubmit}
              />
            ) : (
              <Error>
                This article draft does not exist or has been deleted
              </Error>
            )}
          </>
        ) : (
          <>
            <LoaderBlock size="small" height="20px" />
          </>
        )}
      </main>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

export default ArticleEditorPage
