import { IArticleElementProcessor } from "../../../../types/ArticleEditor/Processor"

export const listItemProcessor: IArticleElementProcessor = {
  transformSlateToMarkdownMdhast: (node: any) => {
    return {
      type: "listItem",
      spread: node.spread,
      children: [
        {
          type: "paragraph",
          children: node.children.map((child: any) => {
            const text = {
              type: "text",
              value: child.text,
            }
            if (child.strong) return { type: "strong", children: [text] }
            if (child.emphasis) return { type: "emphasis", children: [text] }
            return text
          }),
        },
      ],
    }
  },
}
