import { visit } from "unist-util-visit"

/**
 * Replaces the `{{process.env.NAME}}` strings by `process.env.NAME` where
 * process.env is the environment variable array.
 */
const regex = /\{\{process\.env\.([a-zA-Z0-9_]*)\}\}/
export function retextEnvVariables() {
  return (tree: any) => {
    visit(tree, "inlineCode", (node) => {
      const match = node.value.match(regex)
      if (match && match[1]) {
        node.value = "" + process.env[match[1]]
      }
    })
  }
}
