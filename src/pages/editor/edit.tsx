import type { NextPage } from 'next'
import  { useRef, } from "react";
import { Node, Descendant } from "slate"
import layout from '../../styles/Layout.module.scss'
import cs from 'classnames'
import { Spacing } from '../../components/Layout/Spacing'
import { SectionHeader } from '../../components/Layout/SectionHeader'
import Head from 'next/head'
import { TitleHyphen } from '../../components/Layout/TitleHyphen'
import path from "path";
import fs from "fs"
import { GetStaticProps } from "next";
import {SlateEditor} from '../../components/NFTArticle/SlateEditor';
import {getSlateEditorStateFromMarkdown} from '../../components/NFTArticle/NFTArticleProcessor';

interface EditorPageProps {
  editorState: Descendant[]
}
const EditorPage: NextPage<EditorPageProps> = ({ editorState }) => {
  const ref = useRef<Node[]>(null);
  return (
    <>
      <Head>
        <title>fxhash — sandbox</title>
        <meta key="og:title" property="og:title" content="fxhash — NFT article editor"/>
        <meta key="description" name="description" content="Experiment and test your NFT articles in the editor environment"/>
        <meta key="og:description" property="og:description" content="Experiment and test your NFT articles in the editor environment"/>
      </Head>

      <Spacing size="6x-large" sm="3x-large" />

      <section>
        <SectionHeader>
          <TitleHyphen>NFT article editor</TitleHyphen>
        </SectionHeader>

        <Spacing size="x-large"/>

        <main className={cs(layout['padding-big'])}>
	  <SlateEditor ref={ref} initialValue={editorState} />
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
  const {editorState}= await getSlateEditorStateFromMarkdown(nftArticleMd);
  return {
    props: {
      editorState,
    },
  }
}

