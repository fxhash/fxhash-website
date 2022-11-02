import { SlateBuilder } from "remark-slate-transformer/lib/transformers/slate-to-mdast"
import { Node } from "unist"

export interface IArticleElementProcessor {
  htmlTagName?: string
  htmlAttributes?: string[]
  transformMdhastToComponent?: (
    node: Node,
    properties: any
  ) => Omit<any, "children"> | null
  transformSlateToMarkdownMdhast?: SlateBuilder
  transformMarkdownMdhastToSlate?: (node: any) => object
}
