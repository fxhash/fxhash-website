import { PageArticle } from "../../containers/Article/PageArticle";
import { GetServerSideProps, NextPage } from "next";
import client from "../../services/ApolloClient";
import { ParsedUrlQuery } from "querystring";
import { Qu_articleBySlug } from "../../queries/articles";
import { NFTArticle } from "../../types/entities/Article";
import { Error } from "../../components/Error/Error";
import { getAbsoluteUrl } from "../../utils/host";
import { ErrorPage } from "../../components/Error/ErrorPage";
import { isArticleFlagged } from "../../utils/entities/articles";

interface ArticleBySlugProps {
  article?: NFTArticle
  origin?: string
  error?: string,
}
const ArticleBySlug: NextPage<ArticleBySlugProps> = ({ error, article, origin }) =>
  error ?
    <ErrorPage title="An error occurred">
      {error}
    </ErrorPage> : (
    <PageArticle article={article!} originUrl={origin!} />
  );

export default ArticleBySlug;

interface ArticleBySlugParams extends ParsedUrlQuery {
  slug: string
}
export const getServerSideProps: GetServerSideProps<ArticleBySlugProps, ArticleBySlugParams> = async ({ req, params }) => {
  const slug = params?.slug!;
  const { origin } = getAbsoluteUrl(req);
  try {
    const { data } = await client.query<{ article: NFTArticle }>({
      query: Qu_articleBySlug,
      variables: {
        slug
      }
    });
    if (!data?.article) {
      return { notFound: true };
    }
    if (isArticleFlagged(data.article)) {
      return {
        props: {
          error: `This article has been flagged and as such it is not possible to access its URL with the slug.\n We do not want to encourage "domain-sitting" practices.`
        }
      }
    }
    return ({
      props: {
        article: data.article,
        origin,
      }
    })
  } catch (e) {
    console.error(e);
    return {
      props: {
        error: 'The article could not be loaded'
      }
    }
  }
}
