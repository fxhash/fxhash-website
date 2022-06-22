import matter from "gray-matter"
import remarkDirective from "remark-directive"
import stringify from "remark-stringify";
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
import rehypeReact, { Options } from "rehype-react";
import { SharedOptions } from "rehype-react/lib";
import rehypeHighlight from "rehype-highlight";
import type { ComponentsWithNodeOptions, ComponentsWithoutNodeOptions } from "rehype-react/lib/complex-types";
import { NFTArticleElementComponent } from "../../types/Article";
import TezosStorage from "./elements/TezosStorage";
import Embed from "./elements/Embed";
import type {Element} from 'hast'
import rehypeKatex from "rehype-katex";
import { MdastBuilder, OverridedMdastBuilders } from "remark-slate-transformer/lib/transformers/mdast-to-slate"
import { OverridedSlateBuilders } from "remark-slate-transformer/lib/transformers/slate-to-mdast"
import { remarkToSlate, slateToRemark } from "remark-slate-transformer"
import { Node, Descendant } from "slate";
import { Root, Content } from 'mdast'


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
export const customNodes: CustomArticleElementsByType = {
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
  content: any
}
export async function getNFTArticleComponentsFromMarkdown(markdown: string): Promise<PayloadNFTArticleComponentsFromMarkdown | null> {
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
    children:  next(node.children), 
    ...propertiesWithoutUndefined
  };
}

function createMathNode(node: any) {
  return {
    type: node.type, 
    children: [{text: ''}], 
    data : {
      ...node.data,
      math: node.value, 
    }
  }
}

const remarkSlateTransformerOverrides: OverridedMdastBuilders = {
  textDirective:  createDirectiveNode, 
  leafDirective:  createDirectiveNode, 
  containerDirective:  createDirectiveNode,
  "inlineMath": createMathNode, 
  "math": createMathNode, 
}

interface PayloadSlateEditorStateFromMarkdown {
  [p: string]: any
  editorState: Descendant[]
}

export async function getSlateEditorStateFromMarkdown(markdown: string): Promise<PayloadSlateEditorStateFromMarkdown | null>  {
  try {
    const matterResult = matter(markdown)
    const processed = await unified()
      .use(remarkParse)
      .use(remarkMath)
      .use(rehypeKatex)
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
  } catch {
    return null;
  }
}

function convertSlateLeafDirectiveToMarkdown(
  node: any, 
) { 
  const { children, type, ...attributes} = node
  return { 
    type: 'leafDirective',
    name: type, 
    children: [
      {
	type: 'text',
	value: children[0].text,
      }
    ],
    attributes, 
  }
}


const slateToRemarkTransformerOverrides: OverridedSlateBuilders = {
  'tezos-storage': convertSlateLeafDirectiveToMarkdown,
  'embed-media': convertSlateLeafDirectiveToMarkdown, 
  inlineMath: (node: any) => ({ 
    type: node.type, 
    value: node?.data?.math, 
    data: { ...node.data} 
  }),	  
  math: (node: any) => ({ 
    type: node.type, 
    value: node?.data?.math, 
    data: { ...node.data} 
  }),	  
}

export async function getMarkdownFromSlateEditorState(slate: Node[] ) {
  try {
    const markdown = await new Promise((resolve) => {
      const processor = unified()
      .use(remarkMath)
      .use(remarkDirective)
      .use(remarkFxHashCustom)
      .use(slateToRemark, {
	overrides: slateToRemarkTransformerOverrides, 
      })
      .use(stringify)
      const ast = processor.runSync({
	type: "root",
	children: slate,
      })
      const text = processor.stringify(ast)
      resolve(text)
    })
    return markdown
  } catch(e) {
    console.error(e)
    return null;
  }
}
