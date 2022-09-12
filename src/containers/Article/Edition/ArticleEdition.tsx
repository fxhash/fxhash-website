import { ArticleEditor } from "../../../containers/Article/Editor/ArticleEditor"
import React, { FunctionComponent, useCallback, useContext, useEffect, useState } from "react"
import { ArticlesContext } from "../../../context/Articles"
import { useRouter } from "next/router"
import { LoaderBlock } from "../../../components/Layout/LoaderBlock"
import useInit from "../../../hooks/useInit"
import { NFTArticle } from "../../../types/entities/Article"
import { generateNFTArticleDraft } from "../../../utils/nft-article"
import { NFTArticleForm } from "../../../types/ArticleEditor/Editor"

interface Props {
  article: NFTArticle
  origin?: string
}
const ArticleEdition: FunctionComponent<Props> = ({
  article,
  origin,
}) => {
  const [hasLoadUpToDate, setHasLoadUpToDate] = useState(false)
  const router = useRouter()
  const { state, dispatch } = useContext(ArticlesContext)
  const id = ""+article!.id

  const handleSubmit = useCallback((values) => {
    dispatch({
      type: 'save',
      payload: {
        id: id,
        articleForm: values,
        minted: true,
      }
    })
    router.push(`/article/editor/${id}/preview`)
  }, [dispatch, router])

  useInit(() => {
    dispatch({ type: 'loadAll' })
    setHasLoadUpToDate(true)
  })

  // check if an article with the same ID exists locally, if not create a new
  // draft article in the memory with the same ID
  useEffect(() => {
    if (hasLoadUpToDate) {
      // if no article in the state, instanciate a draft
      if (!state.articles[id]) {
        const draft = generateNFTArticleDraft(article!)
        dispatch({
          type: "save",
          payload: {
            id: id,
            articleForm: draft as NFTArticleForm,
            minted: true,
          }
        })
      }
    }
  }, [hasLoadUpToDate])

  // pull the draft from the articles local state
  const localDraft = state.articles[id] || null
  const ready = hasLoadUpToDate && router.isReady && localDraft

  return ready ? (
    <ArticleEditor
      initialValues={localDraft.form}
      hasLocalAutosave
      localId={id}
      onSubmit={handleSubmit}
      editMinted
    />
  ):(
    <LoaderBlock
      size="small"
      height="60vh"
    />
  )
}

export default ArticleEdition
