import React, { useContext, useEffect, useState } from "react"
import { ArticlesContext } from "../../../context/Articles"
import { LoaderBlock } from "../../../components/Layout/LoaderBlock"
import useInit from "../../../hooks/useInit"
import { PageArticle } from "../../../containers/Article/PageArticle"
import { NFTArticle } from "../../../types/entities/Article"
import { Spacing } from "../../../components/Layout/Spacing"
import { cloneDeep } from "@apollo/client/utilities"
import { ButtonsEditArticle } from "./ButtonsEditArticle"

interface Props {
  article: NFTArticle
  origin: string
}
export function ArticleEditionPreview({
  article,
  origin,
}: Props) {
  const id = article.id
  const { state, dispatch } = useContext(ArticlesContext)

  const [hasLoadUpToDate, setHasLoadUpToDate] = useState(false)
  const [editedArticle, setEditedArticle] = useState<NFTArticle | null>(null)

  // initial load of all the articles from the state
  useInit(() => {
    dispatch({ type: 'loadAll' })
    setHasLoadUpToDate(true)
  })

  // when the articles are loaded, create an article from the form
  useEffect(() => {
    const draft = state.articles[id]
    if (draft) {
      // edit the properties of the article based on edition data
      const edited = cloneDeep(article)
      edited.title = draft.form.title
      edited.body = draft.form.body
      edited.tags = draft.form.tags
      edited.thumbnailUri = draft.form.thumbnailUri as string
      edited.displayUri = draft.form.thumbnailUri as string
      edited.thumbnailCaption = draft.form.thumbnailCaption
      edited.description = draft.form.abstract
      // todo [#392] remove if (edited.metadata) and content
      if (edited.metadata) {
        edited.metadata.thumbnailCaption = draft.form.thumbnailCaption
      }
      setEditedArticle(edited)
    }
  }, [article, hasLoadUpToDate, id, state.articles])

  return editedArticle ? (
    <>
      <PageArticle
        article={editedArticle}
        isPreview
        originUrl={origin}
      />
      <Spacing size="6x-large" />
      <ButtonsEditArticle
        article={editedArticle}
      />
      <Spacing size="6x-large" />
    </>
  ):(
    <LoaderBlock
      size="small"
      height="60vh"
    />
  )
}
