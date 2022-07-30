import { Root } from "mdast"
import { Transformer } from "unified"
import { visit } from "unist-util-visit"
import { h } from "hastscript"
import { NFTArticleElementComponent } from "../../../types/Article"
import Embed from "../elements/Embed/Embed"
import TezosStorageEditor from "../SlateEditor/Elements/TezosStorageEditor"

interface CustomArticleElementsByType {
  leafDirective: Record<string, NFTArticleElementComponent<any>>,
  textDirective: Record<string, NFTArticleElementComponent<any>>,
  containerDirective: Record<string, NFTArticleElementComponent<any>>,
}
export const customNodes: CustomArticleElementsByType = {
  leafDirective: {
    "tezos-storage": TezosStorageEditor,
    "embed-media": Embed,
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
        if (component.getPropsFromNode) {
          const hast: any = h(node.name, node.attributes)
          const props = component.getPropsFromNode(node, hast.properties)
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

