import layout from "../../styles/Layout.module.scss"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { SectionHeader } from "../../components/Layout/SectionHeader"
import { Spacing } from "../../components/Layout/Spacing"
import { getArticleData, getArticleIds } from "../../services/LocalFiles"
import { Article } from "../../types/Article"
import cs from "classnames"
import { ArticleContent } from "../../components/Article/ArticleContent"
import Head from "next/head"


interface Props {
  article: Article
}

const ArticlePage: NextPage<Props> = ({ article }) => {
  return (
    <>
      <Head>
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