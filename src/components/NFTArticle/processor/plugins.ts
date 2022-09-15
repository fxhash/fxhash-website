import { Parent, PhrasingContent, Root } from "mdast"
import { Transformer } from "unified"
import { visit } from "unist-util-visit"
import { h } from "hastscript"
import { u } from 'unist-builder'
import { IArticleElementProcessor } from "../../../types/ArticleEditor/Processor";
import { embedProcessor } from "../elements/Embed/EmbedProcessor";
import { tezosStorageProcessor } from "../elements/TezosStorage/TezosStorageProcessor";
import { videoProcessor } from "../elements/Video/VideoProcessor";
import { findAndReplace } from "mdast-util-find-and-replace";
import { mentionProcessor } from "../elements/Mention/MentionProcessor";


// declare module 'mdast' {
//   interface Mention extends Parent {
//     type: 'mention';
//     value: string;
//     children: PhrasingContent[];
//   }
//   interface StaticPhrasingContentMap {
//     mention: Mention;
//   }
// }

interface CustomArticleElementsByType {
  leafDirective: Record<string, IArticleElementProcessor>,
  textDirective: Record<string, IArticleElementProcessor>,
  containerDirective: Record<string, IArticleElementProcessor>,
}
export const customNodes: CustomArticleElementsByType = {
  leafDirective: {
    "tezos-storage-pointer": tezosStorageProcessor,
    "embed-media": embedProcessor,
    "video": videoProcessor,
  },
  textDirective: {},
  containerDirective: {},
}
export function remarkFxHashCustom(): Transformer<Root, Root> {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (
        node.type === 'textDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'containerDirective'
      ) {
        const component = customNodes[node.type]?.[node.name]
        if (component?.transformMdhastToComponent) {
          const hast: any = h(node.name, node.attributes)
          const props = component.transformMdhastToComponent(node, hast.properties)
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
export function remarkMentions(): Transformer<Root, Root> {
  return (tree: Root) => {
    visit(tree, (node: any) => {
      if (node.type === 'mention') {
        const component = mentionProcessor;
        if (component?.transformMdhastToComponent) {
          const hast: any = h(node.name, { value: node.value });
          const props = component.transformMdhastToComponent(node, hast.properties)
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

export function mdastFlattenListItemParagraphs(): Transformer<Root, Root> {
  return (ast) => {
    visit<any, any>(ast, 'listItem', (listItem: any) => {
      if (
        listItem.children.length === 1 &&
        listItem.children[0].type === 'paragraph'
      ) {
        listItem.children = listItem.children[0].children;
      }
      return listItem;
    });
    return ast;
  };
}

export function mdastParseMentions(): Transformer<Root, Root> {
  return (ast) => {
    // @ts-ignore
    findAndReplace(ast, [
      [/@(tz[1-3][1-9a-zA-Z]{33})/g, function ($0: any, $1: any) {
        return u('mention', { name: 'mention', value: $1 }, [{ type: 'text', value: '' }]);
      }]
    ]);
    return ast;
  }
}
