import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import cs from "classnames"
import style from "./ButtonsArticlePreview.module.scss"
import text from "../../styles/Text.module.css"
import { Button } from "../../components/Button";
import Link from 'next/link';
import useFetch, { CachePolicies } from "use-http";
import { API_FILE__ARTICLE_UPLOAD_METADATA } from "../../services/apis/file-api.service";
import { NFTArticle } from "../../types/entities/Article";
import { ipfsCidFromUriOrCid } from "../../services/Ipfs";
import { useRouter } from "next/router";
import { useContractOperation } from "../../hooks/useContractOperation";
import { MintArticleOperation, TMintArticleOperationParams } from "../../services/contract-operations/MintArticle";
import { ContractFeedback } from "../../components/Feedback/ContractFeedback";
import { ArticlesContext } from "../../context/Articles";
import { UserContext } from "../UserProvider";
import { Error } from "../../components/Error/Error";
import { countWords } from "../../utils/strings";
import { getUserProfileLink } from '../../utils/user';
import { User } from '../../types/entities/User';
import { Submit } from '../../components/Form/Submit';

interface ButtonsArticlePreviewProps {
  id: string | number
  article: NFTArticle
}

const _ButtonsArticlePreview = ({ id, article }: ButtonsArticlePreviewProps) => {
  const { user } = useContext(UserContext)
  const { dispatch } = useContext(ArticlesContext)
  const router = useRouter();
  const { 
    post: uploadMetadata,
    loading: postMetadataLoading
  } = useFetch<any>(API_FILE__ARTICLE_UPLOAD_METADATA, {
    cachePolicy: CachePolicies.NO_CACHE,
  })

  const { 
    state, success, call: mintArticle, error, loading: mintLoading
  } = useContractOperation<TMintArticleOperationParams>(MintArticleOperation)

  const handleClickMint = useCallback(async () => {
    const metadata = {
      thumbnailCid: article.thumbnailUri && ipfsCidFromUriOrCid(article.thumbnailUri),
      articleBody: article.body,
      metadata: {
        name: article.metadata.name,
        description: article.metadata.description,
        minter: article.metadata.minter,
        tags: article.metadata.tags,
        thumbnailCaption: article.metadata.thumbnailCaption
      }
    }
    try {
      const { metadataCID } = await uploadMetadata(metadata);
      console.log({metadataCID})
      mintArticle({
        data: {
          metadataCid: metadataCID,
          distribution: {
            editions: article.editions.toString(),
            royalties: article.royalties.toString(),
            royalties_split: article.royaltiesSplits.map(split => ({ address: split.user.id, pct: split.pct })),
          }
        }
      });
    } catch (e) {
      console.error(e)
    }
  }, [article, uploadMetadata, mintArticle])

  useEffect(() => {
    if (success) {
      dispatch({ type: 'delete', payload: { id: id.toString() }})
    }
  }, [dispatch, id, success, router, user])

  const canMintArticle = useMemo<boolean>(() => {
    if (!article.body
      || !article.metadata.name
      || (!article.metadata.description || countWords(article.metadata.description) > 500)
      || article.royaltiesSplits.length < 1
      || (article.royalties < 0 || article.royalties > 250)
      || article.editions < 1
    ) return false;
    return true;
  }, [article])

  // any async loading loading
  const loading = postMetadataLoading || mintLoading

  return (
    <div className={style.container}>
      {!canMintArticle &&
        <Error>
          Before minting your article, you need to fix remaining errors in the editor
        </Error>
      }
      <p className={cs(text.info)}>
        Note: articles can be edited even after they&apos;re minted
      </p>
      <ContractFeedback
        className={style.feedback}
        state={state}
        success={success}
        error={error}
        loading={mintLoading}
        successMessage={`Your article was successfully minted.`}
      />
      {!success ? (
        <div className={style.buttons}>
          {!loading && (
            <Link href={`/article/editor/local/${id}`} passHref>
              <Button
                isLink
                type="button"
                size="large"
                color="transparent"
              >
                {'< edit'}
              </Button>
            </Link>
          )}
          <Button
            type="submit"
            size="large-x"
            color="secondary"
            state={loading ? 'loading' : 'default'}
            onClick={handleClickMint}
            disabled={!canMintArticle}
          >
            mint
          </Button>
        </div>
      ):(
        <Submit layout="center">
          <Link href={`${getUserProfileLink(user as User)}/articles`}>
            <Button
              isLink
              type="button"
              size="large"
              color="secondary"
              iconComp={<i aria-hidden className="fas fa-arrow-right"/>}
              iconSide="right"
            >
              open your profile
            </Button>
          </Link>
        </Submit>
      )}
    </div>
  );
};

export const ButtonsArticlePreview = memo(_ButtonsArticlePreview);
