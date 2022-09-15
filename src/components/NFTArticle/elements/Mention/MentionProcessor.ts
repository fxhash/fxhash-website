import { IArticleElementProcessor } from "../../../../types/ArticleEditor/Processor"

export const mentionProcessor: IArticleElementProcessor = {
  transformSlateToMarkdownMdhast: (node: any) => {
    return {
      type: "text",
      value: `@${node.tzAddress}`,
    }
  },
  transformMarkdownMdhastToSlate: (node: any) => ({
    type: node.type,
    children: [{ text: "" }],
    tzAddress: node.value,
  }),
  transformMdhastToComponent: (node, properties) => {
    return {
      tzAddress: properties.value,
    }
  },
}
