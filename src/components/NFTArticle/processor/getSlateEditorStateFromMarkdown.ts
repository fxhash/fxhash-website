import { Descendant } from "slate";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkUnwrapImages from "remark-unwrap-images";
import remarkDirective from "remark-directive";
import { remarkToSlate } from "remark-slate-transformer";
import { OverridedMdastBuilders } from "remark-slate-transformer/lib/transformers/mdast-to-slate";
import {
  mdastFlattenListItemParagraphs,
  mdastParseMentions,
  remarkFxHashCustom,
} from "./plugins";
import remarkGfm from "remark-gfm";
import { mathProcessor } from "../elements/Math/MathProcessor";
import { imageProcessor } from "../elements/Image/ImageProcessor";
import { videoProcessor } from "../elements/Video/VideoProcessor";
import { mentionProcessor } from "../elements/Mention/MentionProcessor";
import { audioProcessor } from "../elements/Audio/AudioProcessor";

interface DirectiveNodeProps {
  [key: string]: any;
}

const directives: Record<string, (node: any) => object> = {
  video: videoProcessor.transformMarkdownMdhastToSlate!,
  audio: audioProcessor.transformMarkdownMdhastToSlate!,
};

function createDirectiveNode(
  node: any,
  next: (children: any[]) => any
): object {
  const data = node.data || {};
  const hProperties: { [key: string]: any } = (data.hProperties || {}) as {
    [key: string]: any;
  };
  // extract only defined props to avoid error serialization of undefined
  const propertiesWithoutUndefined: DirectiveNodeProps = Object.keys(
    hProperties
  ).reduce((acc: DirectiveNodeProps, key: string) => {
    const value = hProperties[key];
    if (value) {
      acc[key] = value;
    }
    return acc;
  }, {});
  const newNode = {
    type: data.hName,
    children: next(node.children),
    ...propertiesWithoutUndefined,
  };
  const instanciateNode = directives[newNode.type];
  return instanciateNode ? instanciateNode(newNode) : newNode;
}
const remarkSlateTransformerOverrides: OverridedMdastBuilders = {
  textDirective: createDirectiveNode,
  leafDirective: createDirectiveNode,
  containerDirective: createDirectiveNode,
  inlineMath: mathProcessor.transformMarkdownMdhastToSlate,
  math: mathProcessor.transformMarkdownMdhastToSlate,
  image: imageProcessor.transformMarkdownMdhastToSlate,
  mention: mentionProcessor.transformMarkdownMdhastToSlate,
};

export interface PayloadSlateEditorStateFromMarkdown {
  [p: string]: any
  editorState: Descendant[]
}

const mdToSlateProcessor = unified()
  .use(remarkParse)
  .use(mdastFlattenListItemParagraphs)
  .use(mdastParseMentions)
  .use(remarkMath)
  .use(remarkGfm)
  .use(remarkUnwrapImages)
  .use(remarkDirective)
  .use(remarkFxHashCustom)
  .use(remarkToSlate, {
    overrides: remarkSlateTransformerOverrides,
  })


export default async function getSlateEditorStateFromMarkdown(markdown: string): Promise<PayloadSlateEditorStateFromMarkdown | null>  {
  try {
    const matterResult = matter(markdown)
    const processed = await mdToSlateProcessor.process(matterResult.content)

    return {
      ...matterResult.data,
      editorState: processed.result as Descendant[]
    };
  } catch(e)  {
    console.error(e)
    return null;
  }
}

export function getSlateEditorStateFromMarkdownSync(markdown: string): PayloadSlateEditorStateFromMarkdown | null  {
  try {
    const matterResult = matter(markdown)
    const processed = mdToSlateProcessor.processSync(matterResult.content)
    return {
      ...matterResult.data,
      editorState: processed.result as Descendant[],
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}
