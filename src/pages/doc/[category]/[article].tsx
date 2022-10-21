import layout from "../../../styles/Layout.module.scss"
import style from "../../../styles/pages/doc-article.module.scss"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { Spacing } from "../../../components/Layout/Spacing"
import { getDocIds, getArticle } from "../../../services/LocalFiles"
import { Article } from "../../../types/Article"
import cs from "classnames"
import { ArticleContent } from "../../../components/Article/ArticleContent"
import Head from "next/head"
import { truncateEnd } from "../../../utils/strings"
import { SectionTitle } from "../../../components/Layout/SectionTitle"
import { DocLayout } from "../../../components/Doc/DocLayout"
import { format } from "date-fns"

interface Props {
  categoryLink: string
  articleLink: string
  article: Article
}

const DocArticlePage: NextPage<Props> = ({
  categoryLink,
  articleLink,
  article,
}) => {
  const date = new Date(article.date)
  return (
    <>
      <Head>
        <title>fxhash — {article.title}</title>
        <meta
          key="og:title"
          property="og:title"
          content={`fxhash — ${article.title}`}
        />
        <meta
          key="description"
          name="description"
          content={truncateEnd(article.description || "", 200, "")}
        />
        <meta
          key="og:description"
          property="og:description"
          content={truncateEnd(article.description || "", 200, "")}
        />
        <meta key="og:type" property="og:type" content="article" />
        <meta
          key="og:image"
          property="og:image"
          content="https://www.fxhash.xyz/images/og/og1.jpg"
        />
        <link rel="stylesheet" href="/highlight/dracula.css" />
      </Head>

      <Spacing size="large" sm="x-large" />

      <section>
        <DocLayout activeCategory={categoryLink} activeArticle={articleLink}>
          <main className={cs(style.content)}>
            <SectionTitle>{article.title}</SectionTitle>
            <p className={cs(style.date)}>
              Last update: {format(date, "d LLLL yyy")}
            </p>
            <ArticleContent content={article.contentHtml} />
          </main>
        </DocLayout>
      </section>

      <Spacing size="6x-large" sm="6x-large" />
      <Spacing size="6x-large" sm="none" />
      <Spacing size="6x-large" sm="none" />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getDocIds()
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const categoryLink = params?.category
  const articleLink = params?.article

  // get the data of the page based on category / article
  const article =
    categoryLink &&
    articleLink &&
    (await getArticle(categoryLink as string, articleLink as string))

  return {
    props: {
      categoryLink,
      articleLink,
      article,
    },
    notFound: !article,
  }
}

export default DocArticlePage
