import { visit } from "unist-util-visit"
import type { Transformer } from "unified"
import type { Root } from "mdast"
import { h } from "hastscript"

export function githubDirectivePlugin(): Transformer<Root, Root> {
  return (tree: any) => {
    visit(tree, (node) => {
      if (
        node.type === "textDirective" ||
        node.type === "leafDirective" ||
        node.type === "containerDirective"
      ) {
        if (node.name !== "github") return

        const data = node.data || (node.data = {})
        const hast = h(node.name, node.attributes)

        // data.hName = hast.tagName
        // data.hProperties = hast.properties

        data.hName = "a"
        data.hProperties = {
          ...(hast as any).properties,
          class: "github_wrapper",
          target: "__blank",
        }

        node.children = [
          {
            type: "any",
            data: {
              hName: "i",
              hProperties: {
                class: "fa-brands fa-github",
              },
            },
          },
          {
            type: "any",
            data: {
              hName: "div",
              hProperties: {
                class: "gh_right",
              },
            },
            children: [
              {
                type: "any",
                data: {
                  hName: "span",
                  hProperties: {
                    class: "gh_title",
                  },
                },
                children: [
                  {
                    type: "text",
                    value: node.children[0].value,
                  },
                ],
              },
              {
                type: "any",
                data: {
                  hName: "span",
                  hProperties: {
                    class: "gh_desc",
                  },
                },
                children: [
                  {
                    type: "text",
                    value: node.attributes.desc,
                  },
                ],
              },
            ],
          },
        ]
      }
    })
  }
}
