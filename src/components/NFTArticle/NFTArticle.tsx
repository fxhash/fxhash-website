import React, { memo, useEffect, useState } from 'react';
import { getNFTArticleComponentsFromMarkdown } from "./NFTArticleProcessor";

interface NftArticleProps {
  markdown: string,
}

const _NftArticle = ({ markdown }: NftArticleProps) => {
  const [content, setContent] = useState<React.FunctionComponent | null>(null);
  useEffect(() => {
    const getNFTArticle = async () => {
      const { content }: any = await getNFTArticleComponentsFromMarkdown(markdown);
      if (content) {
        setContent(content);
      }
    };
    getNFTArticle();
  }, [markdown])
  return (
    <div>
      <div>article</div>
      {content}
    </div>
  );
};

export const NftArticle = memo(_NftArticle);
