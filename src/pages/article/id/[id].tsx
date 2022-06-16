import { PageArticle } from "../../../containers/Article/PageArticle";
import { GetServerSideProps, NextPage } from "next";
import client from "../../../services/ApolloClient";
import { ParsedUrlQuery } from "querystring";
import { Qu_articleById } from "../../../queries/articles";
import { NFTArticle } from "../../../types/entities/Article";
import { Error } from "../../../components/Error/Error";
import { getAbsoluteUrl } from "../../../utils/host";

interface ArticleByIdProps {
  article?: NFTArticle,
  origin?: string,
  error?: string,
}
const ArticleById: NextPage<ArticleByIdProps> = ({ error, article, origin }) =>
  error ?
    <Error>{error}</Error> : (
    <PageArticle article={article!} originUrl={origin!} />
  );

export default ArticleById;

interface ArticleByIdParams extends ParsedUrlQuery {
  id: string
}
export const getServerSideProps: GetServerSideProps<ArticleByIdProps, ArticleByIdParams> = async ({ params, req }) => {
  const id = params?.id! && parseInt(params.id);
  if (!id && id !== 0) return { props: { error: 'Invalid URL for article'} };
  const { origin } = getAbsoluteUrl(req);
  try {
    const { data } = await client.query<{ article: NFTArticle }>({
      query: Qu_articleById,
      variables: {
        id,
      }
    });
    if (!data?.article) {
      return { notFound: true };
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
        error: 'An error occured: couldn\'t load the article'
      }
    }
  }
}
