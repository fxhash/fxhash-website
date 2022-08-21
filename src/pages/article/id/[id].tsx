import { PageArticle } from "../../../containers/Article/PageArticle"
import { NextPage } from "next"
import { NFTArticle } from "../../../types/entities/Article"
import { Error } from "../../../components/Error/Error"
import { getServerSidePropsArticleById } from "../../../services/ServerSideProps/ServerSidePropsArticle"

interface ArticleByIdProps {
  article?: NFTArticle,
  origin?: string,
  error?: string,
}
const ArticleById: NextPage<ArticleByIdProps> = ({
  error,
  article,
  origin
}) =>
  error
    ? <Error>{error}</Error>
    : <PageArticle article={article!} originUrl={origin!} />

export default ArticleById
export const getServerSideProps = getServerSidePropsArticleById