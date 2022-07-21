import React, { memo, useEffect, useState } from 'react';
import { getNFTArticleComponentsFromMarkdown } from "./processor/processor";

interface NftArticleProps {
  markdown: string,
}

const _NftArticle = ({ markdown }: NftArticleProps) => {
  const [content, setContent] = useState<React.FunctionComponent | null>(null);
  useEffect(() => {
    const getNFTArticle = async () => {
      const data = await getNFTArticleComponentsFromMarkdown(markdown);
      if (data?.content) {
        setContent(data.content);
      }
    };
    getNFTArticle();
  }, [markdown])
  return (
    <>
      <div>
        <div>article</div>
        {content}
      </div>
    </>
  );
};

export const NftArticle = memo(_NftArticle);
