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
import { Root, } from "mdast";
import { SharedOptions } from "rehype-react/lib";
import TezosStorage from "./elements/TezosStorage";
import rehypeHighlight from "rehype-highlight";
import rehypeMathJaxBrowser from "rehype-mathjax/browser";
import {remarkToSlate, } from "remark-slate-transformer"

declare module "rehype-react" {
  interface CustomComponentsOptions {
    passNode?: false | undefined
    components?: {
      'tezos-storage': JSX.Element
    }
  }
  type Options = SharedOptions &
    (
      | import('rehype-react/lib/complex-types').ComponentsWithNodeOptions
      | import('rehype-react/lib/complex-types').ComponentsWithoutNodeOptions
      | CustomComponentsOptions
    )
}

const customNodes = {
  leafDirective: {
    'tezos-storage': TezosStorage.getPropsFromNode
  }
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

interface DirectiveNodeProps { [key: string]: any }

function createDirectiveNode(node: Root, next: (children: any[]) => any) {
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
    children:  next(node.children), 
    ...propertiesWithoutUndefined
  };
}

export async function getSlateEditorStateFromMarkdown(markdown: string) {
  try {
    const matterResult = matter(markdown)
    const processed = await unified()
      .use(remarkParse)
      .use(remarkDirective)
      .use(remarkFxHashCustom)
      .use(remarkToSlate, {
	overrides: {
	  textDirective:  createDirectiveNode, 
	  leafDirective:  createDirectiveNode, 
	  containerDirective:  createDirectiveNode, 
	},
      })
      .process(matterResult.content)

    return {
      ...matterResult.data, 
      editorState: processed.result
    };
  } catch {
    return null;
  }
}
