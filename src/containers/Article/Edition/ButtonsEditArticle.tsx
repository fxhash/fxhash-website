import style from "./ButtonsEditArticle.module.scss"
import cs from "classnames"
import { NFTArticle } from "../../../types/entities/Article"
import { useCallback, useContext, useEffect } from "react"
import { UserContext } from "../../UserProvider"
import { ArticlesContext } from "../../../context/Articles"
import useFetch, { CachePolicies } from "use-http"
import { API_FILE__ARTICLE_UPLOAD_METADATA } from "../../../services/apis/file-api.service"
import { useContractOperation } from "../../../hooks/useContractOperation"
import { ipfsCidFromUriOrCid } from "../../../services/Ipfs"
import { ContractFeedback } from "../../../components/Feedback/ContractFeedback"
import Link from "next/link"
import { Button } from "../../../components/Button"
import { Submit } from "../../../components/Form/Submit"
import { getUserProfileLink } from "../../../utils/user"
import { User } from "../../../types/entities/User"
import { UpdateArticleOperation } from "../../../services/contract-operations/UpdateArticle"

interface Props {
  article: NFTArticle
}
export function ButtonsEditArticle({
  article,
}: Props) {
  const { user } = useContext(UserContext)
  const { dispatch } = useContext(ArticlesContext)
  const {
    post: uploadMetadata,
    loading: postMetadataLoading
  } = useFetch<any>(API_FILE__ARTICLE_UPLOAD_METADATA, {
    cachePolicy: CachePolicies.NO_CACHE,
  })

  const {
    state, success, call: updateArticle, error, loading: mintLoading
  } = useContractOperation(UpdateArticleOperation)

  const handleClickMint = useCallback(async () => {
    const metadata = {
      thumbnailCid: article.displayUri && ipfsCidFromUriOrCid(article.displayUri),
      articleBody: article.body,
      metadata: {
        name: article.title,
        description: article.description,
        minter: article.metadata.minter,
        tags: article.tags,
        thumbnailCaption: article.thumbnailCaption,
      }
    }
    try {
      const { metadataCID } = await uploadMetadata(metadata)
      updateArticle({
        article: article,
        metadataCid: metadataCID,
      })
    } catch (e) {
      console.error(e)
    }
  }, [article, uploadMetadata, updateArticle])

  useEffect(() => {
    if (success) {
      dispatch({ 
        type: 'delete',
        payload: { id: ""+article.id }
      })
    }
  }, [dispatch, success])

  // any async loading loading
  const loading = postMetadataLoading || mintLoading

  return (
    <div className={style.container}>
      <ContractFeedback
        className={style.feedback}
        state={state}
        success={success}
        error={error}
        loading={mintLoading}
        successMessage={`Your article was successfully updated.`}
      />
      {!success ? (
        <div className={style.buttons}>
          {!loading && (
            <Link href={`/article/editor/${article.id}`} passHref>
              <Button
                isLink
                type="button"
                size="large"
                color="transparent"
              >
                {'< edit'}
              </Button>
            </Link>
          )}
          <Button
            type="submit"
            size="large-x"
            color="secondary"
            state={loading ? 'loading' : 'default'}
            onClick={handleClickMint}
          >
            update
          </Button>
        </div>
      ):(
        <Submit layout="center">
          <Link href={`${getUserProfileLink(user as User)}/articles`}>
            <Button
              isLink
              type="button"
              size="large"
              color="secondary"
              iconComp={<i aria-hidden className="fas fa-arrow-right"/>}
              iconSide="right"
            >
              open your profile
            </Button>
          </Link>
        </Submit>
      )}
    </div>
  )
}