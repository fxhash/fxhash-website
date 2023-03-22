import { visit } from "unist-util-visit"
import type { Transformer } from "unified"
import type { Root } from "mdast"
import { h } from "hastscript"

export function infoboxDirectivePlugin(): Transformer<Root, Root> {
  return (tree: any) => {
    visit(tree, (node) => {
      if (
        node.type === "textDirective" ||
        node.type === "leafDirective" ||
        node.type === "containerDirective"
      ) {
        if (node.name !== "infobox") return

        const data = node.data || (node.data = {})
        const hast = h(node.name, node.attributes)

        // the type of the infobox
        const type = node.attributes?.type ?? "info"

        data.hName = "div"
        data.hProperties = {
          class: `infobox infobox_${type}`,
        }

        // move the children into a span
        const children = node.children
        node.children = [
          {
            type: "any",
            data: {
              hName: "span",
            },
            children,
          },
        ]
      }
    })
  }
}
