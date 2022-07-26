import { Root } from "mdast"
import { visit } from "unist-util-visit"
import { h } from "hastscript"
import { NFTArticleElementComponent } from "../../../types/Article"
import Embed from "../elements/Embed/Embed"
import TezosStorageEditor from "../SlateEditor/Elements/TezosStorageEditor"

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
    'tezos-storage': TezosStorageEditor,
    embed: Embed
  },
  textDirective: {},
  containerDirective: {},
}
export function remarkFxHashCustom(): import('unified').Transformer<import('mdast').Root, import('mdast').Root> {
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
