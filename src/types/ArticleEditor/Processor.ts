import { Node } from "unist"

export interface IArticleElementProcessor {
  htmlTagName?: string
  htmlAttributes?: string[]
  transformMdhastToComponent?: (
    node: Node,
    properties: any
  ) => Omit<any, "children"> | null
  transformSlateToMarkdownMdhast?: (node: any) => object
  transformMarkdownMdhastToSlate?: (node: any) => object
}
