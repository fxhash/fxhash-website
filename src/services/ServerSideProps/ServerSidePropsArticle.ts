import { ParsedUrlQuery } from "querystring"
import { NFTArticle } from "../../types/entities/Article"
import { getAbsoluteUrl } from "../../utils/host"
import client from "../../services/ApolloClient"
import { Qu_articleById, Qu_articleBySlug } from "../../queries/articles"
import { GetServerSideProps } from "next"
import { isArticleFlagged } from "../../utils/entities/articles";

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


interface ArticleBySlugParams extends ParsedUrlQuery {
  slug: string
}
export const getServerSidePropsBySlug: GetServerSideProps<
  Props,
  ArticleBySlugParams
> = async ({ req, params }) => {
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
