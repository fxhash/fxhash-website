import { NextPage } from "next"
import React, { useContext, useEffect, useState } from "react";
import { ArticlesContext } from "../../../../../context/Articles";
import { useRouter } from "next/router";
import { LoaderBlock } from "../../../../../components/Layout/LoaderBlock";
import { Error } from "../../../../../components/Error/Error";
import useInit from "../../../../../hooks/useInit";
import { PageArticle } from "../../../../../containers/Article/PageArticle";
import { generateNftArticleFromDraft } from "../../../../../utils/nft-article";
import { UserContext } from "../../../../../containers/UserProvider";
import { User } from "../../../../../types/entities/User";
import { useLazyQuery } from "@apollo/client";
import { Qu_users } from "../../../../../queries/user";
import { DraftNFTArticle } from "../../../../../types/ArticleEditor/Editor";
import { NFTArticle } from "../../../../../types/entities/Article";
import { Split } from "../../../../../types/entities/Split";

const ArticlePreviewPage: NextPage = () => {
  const [hasLoadUpToDate, setHasLoadUpToDate] = useState(false);
  const [article, setArticle] = useState<NFTArticle | null>(null);
  const router = useRouter();
  const { state, dispatch } = useContext(ArticlesContext);
  const { user } = useContext(UserContext);
  const [getUsers] = useLazyQuery<{ users: User[] }>(Qu_users);
  const localId = typeof router.query.id === 'string' ? router.query.id : null;

  useInit(() => {
    dispatch({ type: 'loadAll' });
  });
  const draftArticle = localId ? state.articles[localId] : null;
  useEffect(() => {
    const fetchUsers = async (article: DraftNFTArticle) => {
      try {
        const { data } = await getUsers({
          variables: {
            filters: {
              id_in: article.form.royaltiesSplit.map(royalty => royalty.address),
            }
          }
        })
        const newArticle = generateNftArticleFromDraft(localId!, article, user as User)
        if (data?.users) {
          newArticle.royaltiesSplits = article.form.royaltiesSplit.reduce((acc, royalty) => {
            const royaltyUser = data.users.find(user => user.id === royalty.address);
            if (royaltyUser) {
              acc.push({
                pct: royalty.pct,
                user: royaltyUser,
              });
            }
            return acc;
          }, [] as Split[])
        }
        setArticle(newArticle);
        setHasLoadUpToDate(true)
      } catch (e) {
        console.error(e);
      }
    }
    if (draftArticle) {
      fetchUsers(draftArticle);
    }
  }, [localId, draftArticle, user, getUsers])

  return (
    <>
      {hasLoadUpToDate && router.isReady ?
        <>
          {(localId && article) ?
            <PageArticle article={article} isPreview />
            : <Error>This article draft does not exist or has been deleted</Error>
          }
        </>
        :
        <>
          <LoaderBlock
            size="small"
            height="20px"
          />
        </>
      }
    </>
  )
}

export default ArticlePreviewPage
