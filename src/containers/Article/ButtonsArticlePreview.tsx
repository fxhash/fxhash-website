import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import style from "./ButtonsArticlePreview.module.scss";
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
import { getUserProfileLink } from "../../utils/user";
import { Error } from "../../components/Error/Error";
import { countWords } from "../../utils/strings";

interface ButtonsArticlePreviewProps {
  id: string | number
  article: NFTArticle
}

const _ButtonsArticlePreview = ({ id, article }: ButtonsArticlePreviewProps) => {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useContext(ArticlesContext);
  const router = useRouter();
  const { post: uploadMetadata } = useFetch<any>(API_FILE__ARTICLE_UPLOAD_METADATA, {
    cachePolicy: CachePolicies.NO_CACHE,
  })

  const { state, success, call: mintArticle, error, loading } = useContractOperation<TMintArticleOperationParams>(MintArticleOperation)

  const handleClickMint = useCallback(async () => {
    setIsLoading(true);
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
      console.error(e);
      setIsLoading(false);
    }
  }, [article, uploadMetadata, mintArticle])

  useEffect(() => {
    if (success) {
      dispatch({ type: 'delete', payload: { id: id.toString() }})
      // todo redirect to article id instead
      // router.push(`/article/id/${idArticle}`);
      if (user) {
        router.push(`${getUserProfileLink(user)}/articles`);
      }
    }
  }, [dispatch, id, success, router, user])

  const canMintArticle = useMemo<boolean>(() => {
    if (!article.body
      || !article.metadata.name
      || (!article.metadata.description || countWords(article.metadata.description) > 500)
      || article.royaltiesSplits.length < 1
      || (article.royalties < 0.1 || article.royalties > 25)
      || article.editions < 1
    ) return false;
    return true;
  }, [article])
  return (
    <div className={style.container}>
      {!canMintArticle &&
        <Error>
          Before minting your article, you need to fix remaining errors in the editor
        </Error>
      }
      <div className={style.buttons}>
        <Link href={`/article/editor/local/${id}`} passHref>
          <Button
            isLink
            type="submit"
            size="very-large"
            color="transparent"
          >
            {'< edit'}
          </Button>
        </Link>
        <Button
          type="submit"
          size="very-large"
          color="secondary"
          state={isLoading ? 'loading' : 'default'}
          onClick={handleClickMint}
          disabled={!canMintArticle}
        >
          mint
        </Button>
      </div>
      <ContractFeedback
        className={style.feedback}
        state={state}
        success={success}
        error={error}
        loading={loading}
        successMessage={`Your article was successfully minted.`}
      />
      <p>
        Articles can be edited even after they&apos;re minted
      </p>
    </div>
  );
};

export const ButtonsArticlePreview = memo(_ButtonsArticlePreview);
