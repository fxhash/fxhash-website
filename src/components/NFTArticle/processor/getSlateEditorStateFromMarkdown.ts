import { Descendant } from "slate";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkUnwrapImages from "remark-unwrap-images";
import remarkDirective from "remark-directive";
import { remarkToSlate } from "remark-slate-transformer";
import { OverridedMdastBuilders } from "remark-slate-transformer/lib/transformers/mdast-to-slate";
import { remarkFxHashCustom } from "./plugins";
import remarkGfm from "remark-gfm";

interface DirectiveNodeProps { [key: string]: any }

function createDirectiveNode(node: any, next: (children: any[]) => any): object {
  const data = node.data || {}
  const hProperties: {[key:string]: any} = (data.hProperties || {}) as {[key:string]: any}
  // extract only defined props to avoid error serialization of undefined
  const propertiesWithoutUndefined: DirectiveNodeProps = Object.keys(hProperties)
    .reduce((acc: DirectiveNodeProps, key: string) =>{
      const value = hProperties[key];
      if (value) {
        acc[key] = value;
      }
      return acc;
    }, {});
  return {
    type: data.hName,
    children: next(node.children),
    ...propertiesWithoutUndefined
  };
}
function createMathNode(node: any) {
  return {
    type: node.type,
    children: [{text: ''}],
    math: node.value,
  }
}

function markdownImageToFigure(node: any) {
  return {
    type: "figure",
    children: [{
      type: "image",
      url: node.url,
      children: [{
        text: ""
      }],
    }, {
      type: "figcaption",
      children: [{
        text: node.alt
      }]
    }]
  }
}

const remarkSlateTransformerOverrides: OverridedMdastBuilders = {
  textDirective:  createDirectiveNode,
  leafDirective:  createDirectiveNode,
  containerDirective:  createDirectiveNode,
  "inlineMath": createMathNode,
  "math": createMathNode,
  image: markdownImageToFigure,
}

interface PayloadSlateEditorStateFromMarkdown {
  [p: string]: any
  editorState: Descendant[]
}

export default async function getSlateEditorStateFromMarkdown(markdown: string): Promise<PayloadSlateEditorStateFromMarkdown | null>  {
  try {
    const matterResult = matter(markdown)
    const processed = await unified()
      .use(remarkParse)
      .use(remarkMath)
      .use(remarkGfm)
      .use(remarkUnwrapImages)
      .use(remarkDirective)
      .use(remarkFxHashCustom)
      .use(remarkToSlate, {
        overrides: remarkSlateTransformerOverrides
      })
      .process(matterResult.content)

    return {
      ...matterResult.data,
      editorState: processed.result as Descendant[]
    };
  } catch(e)  {
    console.error(e)
    return null;
  }
}
