import { ParsedUrlQuery } from "querystring"
import { NFTArticle } from "../../types/entities/Article"
import { getAbsoluteUrl } from "../../utils/host"
import client from "../../services/ApolloClient"
import { Qu_articleById } from "../../queries/articles"
import { GetServerSideProps } from "next"

interface ArticleByIdParams extends ParsedUrlQuery {
  id: string
}

interface Props {
  article?: NFTArticle
  origin?: string
  error?: string
}

export const getServerSidePropsArticleById: GetServerSideProps<
  Props,
  ArticleByIdParams
> = async ({
  params,
  req 
}) => {
  const id = params?.id! && parseInt(params.id)
  if (!id && id !== 0) return { props: { error: 'Invalid URL for article'} }
  const { origin } = getAbsoluteUrl(req)
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