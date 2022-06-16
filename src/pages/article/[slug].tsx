import { PageArticle } from "../../containers/Article/PageArticle";
import { GetServerSideProps, NextPage } from "next";
import client from "../../services/ApolloClient";
import { ParsedUrlQuery } from "querystring";
import { Qu_articleBySlug } from "../../queries/articles";
import { NFTArticle } from "../../types/Article";
import { Error } from "../../components/Error/Error";

interface ArticleBySlugProps {
  article?: NFTArticle
  error?: string,
}
const ArticleBySlug: NextPage<ArticleBySlugProps> = ({ error, article }) =>
  error ?
    <Error>{error}</Error> : (
    <PageArticle article={article!} />
  );

export default ArticleBySlug;

interface ArticleBySlugParams extends ParsedUrlQuery {
  slug: string
}
export const getServerSideProps: GetServerSideProps<ArticleBySlugProps, ArticleBySlugParams> = async ({ params }) => {
  const slug = params?.slug!;
  try {
    const { data } = await client.query<{ article: NFTArticle }>({
      query: Qu_articleBySlug,
      variables: {
        slug,
      }
    });
    if (!data?.article) {
      return { notFound: true };
    }
    return ({
      props: {
        article: data.article
      }
    })
  } catch (e) {
    console.error(e);
    return {
      props: {
        error: 'An error occured: couldn\'t load the article'
      }
    }
  }
}
