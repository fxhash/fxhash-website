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
import rehypeReact  from "rehype-react";
import { createElement, Fragment } from "react";
import { Root } from "mdast";
import { SharedOptions } from "rehype-react/lib";
import TezosStorage from "./elements/TezosStorage";
import rehypeHighlight from "rehype-highlight";
import rehypeMathJaxBrowser from "rehype-mathjax/browser";
import type { ComponentsWithNodeOptions, ComponentsWithoutNodeOptions } from "rehype-react/lib/complex-types";
import { getPropsFromNode } from "../../types/Article";

declare module "rehype-react" {
  interface CustomComponentsOptions {
    passNode?: false | undefined
    components?: {
      'tezos-storage': JSX.Element
    }
  }
  type Options = SharedOptions &
    (
      | ComponentsWithNodeOptions
      | ComponentsWithoutNodeOptions
      | CustomComponentsOptions
    )
}

interface CustomArticleElementsByType {
  leafDirective: {
    [key: string]: getPropsFromNode<any> | undefined
  },
  textDirective: {
    [key: string]: getPropsFromNode<any> | undefined
  },
  containerDirective: {
    [key: string]: getPropsFromNode<any> | undefined
  },
}
const customNodes: CustomArticleElementsByType = {
  leafDirective: {
    'tezos-storage': TezosStorage.getPropsFromNode
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
        const getPropsFromNode = customNodes[node.type]?.[node.name]
        if (getPropsFromNode) {
          const hast: any = h(node.name, node.attributes)
          const props = getPropsFromNode(node, hast.properties);
          const data = node.data || (node.data = {})
          data.hName = hast.tagName
          data.hProperties = props;
        }
      }
    })
  }
}

const settingsRehypeReact = {
  createElement,
  Fragment,
  components: {
    'tezos-storage': TezosStorage,
  }
}
export async function getNFTArticleComponentsFromMarkdown(markdown: string) {
  try {
    const matterResult = matter(markdown)
    const processed = await unified()
      .use(remarkParse)
      .use(remarkMath)
      .use(remarkGfm)
      .use(remarkDirective)
      .use(remarkFxHashCustom)
      .use(remarkRehype)
      .use(rehypeMathJaxBrowser)
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
