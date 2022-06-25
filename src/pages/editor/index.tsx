import type { NextPage } from 'next'
import layout from '../../styles/Layout.module.scss'
import cs from 'classnames'
import { Spacing } from '../../components/Layout/Spacing'
import { SectionHeader } from '../../components/Layout/SectionHeader'
import Head from 'next/head'
import { TitleHyphen } from '../../components/Layout/TitleHyphen'
import path from "path";
import fs from "fs"
import { NftArticle } from "../../components/NFTArticle/NFTArticle";
import { GetStaticProps } from "next";

interface EditorPageProps {
  markdown: string
}
const EditorPage: NextPage<EditorPageProps> = ({ markdown }) => {
  return (
    <>
      <Head>
        <title>fxhash — sandbox</title>
        <meta key="og:title" property="og:title" content="fxhash — NFT article editor"/>
        <meta key="description" name="description" content="Experiment and test your NFT articles in the editor environment"/>
        <meta key="og:description" property="og:description" content="Experiment and test your NFT articles in the editor environment"/>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css" crossOrigin="anonymous" />
        <link rel="stylesheet" href="/highlight/dracula.css"/>
      </Head>

      <Spacing size="6x-large" sm="3x-large" />

      <section>
        <SectionHeader>
          <TitleHyphen>NFT article editor</TitleHyphen>
        </SectionHeader>

        <Spacing size="x-large"/>

        <main className={cs(layout['padding-big'])}>
          <NftArticle markdown={markdown} />
        </main>
      </section>

      <Spacing size="6x-large" sm="5x-large" />
      <Spacing size="6x-large" sm="none" />
      <Spacing size="6x-large" sm="none" />
    </>
  )
}

export default EditorPage

export const getStaticProps: GetStaticProps<EditorPageProps> = async ({ params }) => {
  const filePath = path.join(process.cwd(), "src", "articles",`nft-article-test.md`)
  const nftArticleMd = fs.readFileSync(filePath, 'utf8');
  return {
    props: {
      markdown: nftArticleMd,
    },
  }
}

