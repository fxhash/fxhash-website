import React, { memo, useMemo } from 'react';
import KaTeX from 'katex';

interface KatexProps {
  children: string
  inline?: boolean
}

const _Katex = ({ children, inline }: KatexProps) => {
  const html = useMemo(() => {
    const generatedHtml = KaTeX.renderToString(children, {
      displayMode: !inline,
      throwOnError: false,
    });
    return { __html: generatedHtml };
  }, [children, inline]);
  return (
    <span contentEditable={false} dangerouslySetInnerHTML={html} />
  );
};

export const Katex = memo(_Katex);
