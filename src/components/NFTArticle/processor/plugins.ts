import { Root } from "mdast"
import { Transformer } from "unified"
import { visit } from "unist-util-visit"
import { h } from "hastscript"
import { IArticleElementProcessor } from "../../../types/ArticleEditor/Processor";
import { embedProcessor } from "../elements/Embed/EmbedProcessor";
import { tezosStorageProcessor } from "../elements/TezosStorage/TezosStorageProcessor";
import { videoProcessor } from "../elements/Video/VideoProcessor";
import { audioProcessor } from "../elements/Audio/AudioProcessor";

interface CustomArticleElementsByType {
  leafDirective: Record<string, IArticleElementProcessor>,
  textDirective: Record<string, IArticleElementProcessor>,
  containerDirective: Record<string, IArticleElementProcessor>,
}
export const customNodes: CustomArticleElementsByType = {
  leafDirective: {
    "tezos-storage": tezosStorageProcessor,
    "embed-media": embedProcessor,
    "video": videoProcessor,
    "audio": audioProcessor,
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

