import { createElement, Fragment } from "react";
import Embed from "../elements/Embed/Embed";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkUnwrapImages from "remark-unwrap-images";
import remarkDirective from "remark-directive";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypePrism from "rehype-prism"
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import rehypeReact from "rehype-react";
import { Element } from "hast";
import { ComponentsWithNodeOptions, ComponentsWithoutNodeOptions } from "rehype-react/lib/complex-types";
import { SharedOptions } from "rehype-react/lib";
import { mdastFlattenListItemParagraphs, remarkFxHashCustom } from "./plugins"
import { TezosStorageDisplay } from "../elements/TezosStorage/TezosStorageDisplay"
import { ImageDisplay } from "../elements/Image/ImageDisplay";
import { CodeDisplay } from "../elements/Code/CodeDisplay";
import { ThematicBreakEditor } from "../elements/ThematicBreak/ThematicBreakEditor";
import { VideoDisplay } from "../elements/Video/VideoDisplay";

declare module "rehype-react" {
  interface WithNode {
    node: Element
  }
  interface CustomComponentsOptions {
    [key: string]: any
  }
  interface CustomComponentsWithoutNodeOptions extends Omit<ComponentsWithoutNodeOptions, 'components'> {
    components?: CustomComponentsOptions
  }
  export type Options = SharedOptions &
    (
      | ComponentsWithNodeOptions
      | ComponentsWithoutNodeOptions
      | CustomComponentsWithoutNodeOptions
      );
}

const settingsRehypeReact = {
  createElement,
  Fragment,
  components: {
    'tezos-storage': TezosStorageDisplay,
    'embed-media': Embed,
    'img': ImageDisplay,
    'video': VideoDisplay,
    'pre': CodeDisplay,
    'hr': ThematicBreakEditor,
  }
}
interface PayloadNFTArticleComponentsFromMarkdown {
  [p: string]: any
  content: any
}
export default async function getNFTArticleComponentsFromMarkdown(markdown: string): Promise<PayloadNFTArticleComponentsFromMarkdown | null> {
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
      .use(remarkRehype)
      .use(rehypePrism)
      .use(rehypeKatex)
      .use(rehypeFormat)
      .use(rehypeStringify)
      // todo: fix this, because of image component for some reason
      // @ts-ignore
      .use(rehypeReact, settingsRehypeReact)
      .process(matterResult.content)

    return {
      ...matterResult.data,
      content: processed.result,
    }
  }
  catch {
    return null
  }
}

