import matter from "gray-matter"
import remarkDirective from "remark-directive"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import { unified } from "unified"
import remarkRehype from "remark-rehype"
import remarkMath from "remark-math"
import rehypeFormat from "rehype-format"
import rehypeStringify from "rehype-stringify"
import { visit } from "unist-util-visit";
import { h } from 'hastscript'
import { createElement, Fragment } from "react";
import { Root } from "mdast";
import rehypeReact, { Options } from "rehype-react";
import { SharedOptions } from "rehype-react/lib";
import rehypeHighlight from "rehype-highlight";
import type { ComponentsWithNodeOptions, ComponentsWithoutNodeOptions } from "rehype-react/lib/complex-types";
import { NFTArticleElementComponent } from "../../types/Article";
import TezosStorage from "./elements/TezosStorage";
import Embed from "./elements/Embed";
import type {Element} from 'hast'
import rehypeKatex from "rehype-katex";

declare module "rehype-react" {
  interface WithNode {
    node: Element
  }
  interface CustomComponentsOptions {
    [key: string]: NFTArticleElementComponent<any>
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

interface CustomArticleElementsByType {
  leafDirective: {
    [key: string]: NFTArticleElementComponent<any>
  },
  textDirective: {
    [key: string]: NFTArticleElementComponent<any>
  },
  containerDirective: {
    [key: string]: NFTArticleElementComponent<any>
  },
}
const customNodes: CustomArticleElementsByType = {
  leafDirective: {
    'tezos-storage': TezosStorage,
    embed: Embed
  },
  textDirective: {},
  containerDirective: {},
}

function remarkFxHashCustom(): import('unified').Transformer<import('mdast').Root, import('mdast').Root> {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (
        node.type === 'textDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'containerDirective'
      ) {
        const component = customNodes[node.type]?.[node.name]
        if (component.getPropsFromNode) {
          const hast: any = h(node.name, node.attributes)
          const props = component.getPropsFromNode(node, hast.properties);
          if (props) {
            const data = node.data || (node.data = {})
            data.hName = component.htmlTagName || hast.tagName
            data.hProperties = props;
          }
        }
      }
    })
  }
}

const settingsRehypeReact: Options = {
  createElement,
  Fragment,
  components: {
    'tezos-storage': TezosStorage,
    'embed-media': Embed,
  }
}
interface PayloadNFTArticleComponentsFromMarkdown {
  [p: string]: any
  content: void
}
export async function getNFTArticleComponentsFromMarkdown(markdown: string): Promise<PayloadNFTArticleComponentsFromMarkdown> {
  try {
    const matterResult = matter(markdown)
    const processed = await unified()
      .use(remarkParse)
      .use(remarkMath)
      .use(remarkGfm)
      .use(remarkDirective)
      .use(remarkFxHashCustom)
      .use(remarkRehype)
      .use(rehypeKatex)
      .use(rehypeHighlight)
      .use(rehypeFormat)
      .use(rehypeStringify)
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
