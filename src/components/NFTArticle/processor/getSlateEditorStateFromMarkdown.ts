import { Descendant } from "slate";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkUnwrapImages from "remark-unwrap-images";
import remarkDirective from "remark-directive";
import { remarkToSlate } from "remark-slate-transformer";
import { OverridedMdastBuilders } from "remark-slate-transformer/lib/transformers/mdast-to-slate";
import { mdastFlattenListItemParagraphs, remarkFxHashCustom } from "./plugins";
import remarkGfm from "remark-gfm";

interface DirectiveNodeProps { [key: string]: any }

function createMathNode(node: any) {
  return {
    type: node.type,
    children: [{text: ''}],
    math: node.value,
  }
}
function markdownImageToFigure(node: any) {
  return ({
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
  });
}
function markdownDirectiveVideoToFigure(node: any) {
  return ({
    type: "figure",
    children: [{
      type: "video",
      src: node.src || '',
      children: [{
        text: ""
      }],
    }, {
      type: "figcaption",
      children: node.children,
    }]
  });
}

const directives: Record<string, (node: any) => object> = {
  "video": markdownDirectiveVideoToFigure
}

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
  const newNode = {
    type: data.hName,
    children: next(node.children),
    ...propertiesWithoutUndefined
  };
  const instanciateNode = directives[newNode.type]
  return instanciateNode ? instanciateNode(newNode) : newNode;
}
const remarkSlateTransformerOverrides: OverridedMdastBuilders = {
  textDirective: createDirectiveNode,
  leafDirective: createDirectiveNode,
  containerDirective: createDirectiveNode,
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
      .use(mdastFlattenListItemParagraphs)
      .use(remarkMath)
      .use(remarkGfm)
      .use(remarkUnwrapImages)
      .use(remarkDirective)
      .use(remarkFxHashCustom)
      .use(remarkToSlate, {
        overrides: remarkSlateTransformerOverrides
      })
      .process(matterResult.content)

    console.log(matterResult.content, processed.result)
    return {
      ...matterResult.data,
      editorState: processed.result as Descendant[]
    };
  } catch(e)  {
    console.error(e)
    return null;
  }
}
