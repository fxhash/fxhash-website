import { NextPage } from "next"
import { NFTArticle } from "../../../../types/entities/Article"
import { getServerSidePropsArticleById } from "../../../../services/ServerSideProps/ServerSidePropsArticle"
import {
  UserGuard,
  UserGuardUtils,
} from "../../../../components/Guards/UserGuard"
import { ArticleEditionPreview } from "../../../../containers/Article/Edition/ArticleEditionPreview"

interface Props {
  article: NFTArticle
  origin: string
}
const MintedArticleEditionPreviewPage: NextPage<Props> = ({
  article,
  origin,
}) => {
  return (
    <UserGuard
      forceRedirect
      allowed={UserGuardUtils.AUTHOR_OF(article.author!)}
    >
      <ArticleEditionPreview article={article} origin={origin} />
    </UserGuard>
  )
}

export default MintedArticleEditionPreviewPage
export const getServerSideProps = getServerSidePropsArticleById
