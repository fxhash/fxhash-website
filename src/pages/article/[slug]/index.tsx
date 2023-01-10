import { PageArticle } from "../../../containers/Article/PageArticle"
import { NextPage } from "next"
import { NFTArticle } from "../../../types/entities/Article"
import { ErrorPage } from "../../../components/Error/ErrorPage"
import { getServerSidePropsBySlug } from "../../../services/ServerSideProps/ServerSidePropsArticle"

interface ArticleBySlugProps {
  article?: NFTArticle
  origin?: string
  error?: string
}
const ArticleBySlug: NextPage<ArticleBySlugProps> = ({
  error,
  article,
  origin,
}) =>
  error ? (
    <ErrorPage title="An error occurred">{error}</ErrorPage>
  ) : (
    <PageArticle article={article!} originUrl={origin!} />
  )

export default ArticleBySlug

export const getServerSideProps = getServerSidePropsBySlug
