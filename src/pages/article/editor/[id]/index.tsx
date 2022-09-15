import layout from "../../../../styles/Layout.module.scss"
import cs from "classnames"
import { NextPage } from "next"
import Head from "next/head"
import { Spacing } from "../../../../components/Layout/Spacing"
import React from "react"
import { NFTArticle } from "../../../../types/entities/Article"
import {
  UserGuard,
  UserGuardUtils,
} from "../../../../components/Guards/UserGuard"
import ArticleEdition from "../../../../containers/Article/Edition/ArticleEdition"
import { getServerSidePropsArticleById } from "../../../../services/ServerSideProps/ServerSidePropsArticle"

interface Props {
  article?: NFTArticle
  origin?: string
  error?: string
}
const MintedArticleEditionPage: NextPage<Props> = ({
  article,
  origin,
  error,
}) => {
  return (
    <>
      <Head>
        <title>Edit {article!.title}</title>
        <link href="/highlight/prism-dracula.css" rel="stylesheet" />
      </Head>

      <Spacing size="3x-large" />

      <main className={cs(layout["padding-small"])}>
        <UserGuard
          forceRedirect={true}
          allowed={UserGuardUtils.AUTHOR_OF(article!.author!)}
        >
          <ArticleEdition article={article!} origin={origin} />
        </UserGuard>
      </main>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

export default MintedArticleEditionPage
export const getServerSideProps = getServerSidePropsArticleById
