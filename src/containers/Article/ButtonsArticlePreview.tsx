import React, { memo, useCallback, useState } from 'react';
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

interface ButtonsArticlePreviewProps {
  id: string | number
  article: NFTArticle
}

const _ButtonsArticlePreview = ({ id, article }: ButtonsArticlePreviewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { post: uploadMetadata } = useFetch<any>(API_FILE__ARTICLE_UPLOAD_METADATA, {
    cachePolicy: CachePolicies.NO_CACHE,
  })

  const { state, success, call: mintArticle, error, loading } = useContractOperation<TMintArticleOperationParams>(MintArticleOperation)

  const handleClickMint = useCallback(async () => {
    setIsLoading(true);
    // check that articles is fine
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
      const res = await mintArticle({
        data: {
          metadataCid: metadataCID,
          distribution: {
            editions: article.editions.toString(),
            royalties: article.royalties.toString(),
            royalties_split: article.royaltiesSplits.map(split => ({ address: split.user.id, pct: split.pct })),
          }
        }
      });
      console.log(res);
      setIsLoading(false);
      // redirect to article
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  }, [article, uploadMetadata, mintArticle])
  return (
    <div className={style.container}>
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
        >
          mint
        </Button>
      </div>
      <ContractFeedback className={style.feedback} state={state} success={success} error={error} loading={loading} />
      <p>
        Articles can be edited even after they&apos;re minted
      </p>
    </div>
  );
};

export const ButtonsArticlePreview = memo(_ButtonsArticlePreview);
