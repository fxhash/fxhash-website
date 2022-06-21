import layout from "../../../../styles/Layout.module.scss"
import cs from "classnames"
import { NextPage } from "next"
import Head from "next/head"
import { ArticleEditor } from "../../../../containers/Article/Editor/ArticleEditor"
import { Spacing } from "../../../../components/Layout/Spacing"


interface Props {
  id: string
  initialEditorState: any
}

const ArticleEditorPage: NextPage<Props> = ({
  id,
  initialEditorState,
}) => {
  console.log(initialEditorState)
  return (
    <>
      <Head>
        <title>article edition</title>
      </Head>

      <Spacing size="3x-large"/>
      
      <main className={cs(layout['padding-small'])}>
        <ArticleEditor/>
      </main>
    </>
  )
}

export default ArticleEditorPage