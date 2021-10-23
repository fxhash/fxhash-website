import layout from "../../styles/Layout.module.scss"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { SectionHeader } from "../../components/Layout/SectionHeader"
import { Spacing } from "../../components/Layout/Spacing"
import { getArticleData, getArticleIds } from "../../services/LocalFiles"
import { Article } from "../../types/Article"
import cs from "classnames"
import { ArticleContent } from "../../components/Article/ArticleContent"
import Head from "next/head"
import { truncateEnd } from "../../utils/strings"


interface Props {
  article: Article
}

const ArticlePage: NextPage<Props> = ({ article }) => {
  return (
    <>
      <Head>
        <title>fxhash — {article.title}</title>
        <meta key="og:title" property="og:title" content={`fxhash — ${article.title}`}/> 
        <meta key="description" property="description" content={truncateEnd(article.description || "", 200, "")}/>
        <meta key="og:description" property="og:description" content={truncateEnd(article.description || "", 200, "")}/>
        <meta key="og:type" property="og:type" content="article"/>
        <meta key="og:image" property="og:image" content="/images/og/og1.jpg"/>
        <link rel="stylesheet" href="/highlight/dracula.css"/>
      </Head>

      <Spacing size="6x-large"/>

      <section>
        <SectionHeader>
          <h2>— {article.title}</h2>
        </SectionHeader>

        <Spacing size="x-large"/>

        <main className={cs(layout['padding-big'])}>
          <ArticleContent content={article.contentHtml} />
        </main>
      </section>

      <Spacing size="6x-large"/>
      <Spacing size="6x-large"/>
      <Spacing size="6x-large"/>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  const paths = getArticleIds()
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // fetch necessary data for the blog post using params.id
  const article = params?.id && await getArticleData(params.id as string)
  return {
    props: {
      article
    },
    notFound: !article
  }
}

export default ArticlePage