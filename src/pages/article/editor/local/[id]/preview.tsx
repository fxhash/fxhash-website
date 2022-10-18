import { GetServerSideProps, NextPage } from "next"
import React, { useContext, useEffect, useState } from "react"
import { ArticlesContext } from "../../../../../context/Articles"
import { useRouter } from "next/router"
import { LoaderBlock } from "../../../../../components/Layout/LoaderBlock"
import { Error } from "../../../../../components/Error/Error"
import useInit from "../../../../../hooks/useInit"
import { PageArticle } from "../../../../../containers/Article/PageArticle"
import { generateNftArticleFromDraft } from "../../../../../utils/nft-article"
import { UserContext } from "../../../../../containers/UserProvider"
import { User } from "../../../../../types/entities/User"
import { useLazyQuery } from "@apollo/client"
import { Qu_users } from "../../../../../queries/user"
import { DraftNFTArticle } from "../../../../../types/ArticleEditor/Editor"
import { NFTArticle } from "../../../../../types/entities/Article"
import { Split } from "../../../../../types/entities/Split"
import { getAbsoluteUrl } from "../../../../../utils/host"
import { ButtonsArticlePreview } from "../../../../../containers/Article/ButtonsArticlePreview"
import { Spacing } from "../../../../../components/Layout/Spacing"

interface ArticlePreviewPageProps {
  origin: string
}
const ArticlePreviewPage: NextPage<ArticlePreviewPageProps> = ({ origin }) => {
  const [hasLoadUpToDate, setHasLoadUpToDate] = useState(false)
  const [article, setArticle] = useState<NFTArticle | null>(null)
  const router = useRouter()
  const { state, dispatch } = useContext(ArticlesContext)
  const { user } = useContext(UserContext)
  const [getUsers] = useLazyQuery<{ users: User[] }>(Qu_users)
  const localId = typeof router.query.id === "string" ? router.query.id : null

  useInit(() => {
    dispatch({ type: "loadAll" })
    setHasLoadUpToDate(true)
  })
  const draftArticle = localId ? state.articles[localId] : null

  useEffect(() => {
    const fetchUsers = async (article: DraftNFTArticle) => {
      try {
        const { data } = await getUsers({
          variables: {
            filters: {
              id_in: article.form.royaltiesSplit.map(
                (royalty) => royalty.address
              ),
              skip: 0,
              take: 500,
            },
          },
        })
        const newArticle = generateNftArticleFromDraft(
          localId!,
          article,
          user as User
        )
        if (data?.users) {
          newArticle.royaltiesSplits = article.form.royaltiesSplit.reduce(
            (acc, royalty) => {
              const royaltyUser = data.users.find(
                (user) => user.id === royalty.address
              )
              acc.push({
                pct: royalty.pct,
                user:
                  royaltyUser ||
                  ({
                    id: royalty.address,
                  } as User),
              })
              return acc
            },
            [] as Split[]
          )
        }
        setArticle(newArticle)
      } catch (e) {
        console.error(e)
      }
    }
    if (draftArticle) {
      fetchUsers(draftArticle)
    }
  }, [localId, draftArticle, user, getUsers])

  return (
    <>
      {!hasLoadUpToDate || !router.isReady || (draftArticle && !article) ? (
        <LoaderBlock size="small" height="20px" />
      ) : (
        <>
          {localId && article ? (
            <>
              <PageArticle article={article} isPreview originUrl={origin} />
              <ButtonsArticlePreview id={article.id} article={article} />
              <Spacing size="6x-large" />
            </>
          ) : (
            <Error>This article draft does not exist or has been deleted</Error>
          )}
        </>
      )}
    </>
  )
}

export default ArticlePreviewPage

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { origin } = getAbsoluteUrl(req)
  return {
    props: {
      origin,
    },
  }
}
