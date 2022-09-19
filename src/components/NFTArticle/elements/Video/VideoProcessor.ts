import { IArticleElementProcessor } from "../../../../types/ArticleEditor/Processor"

export const videoProcessor: IArticleElementProcessor = {
  transformMdhastToComponent: (node, properties) => {
    return {
      src: properties.src || "",
    }
  },
  transformMarkdownMdhastToSlate: (node) => {
    return {
      type: "figure",
      children: [
        {
          type: "video",
          src: node.src || "",
          children: [
            {
              text: "",
            },
          ],
        },
        {
          type: "figcaption",
          children: node.children,
        },
      ],
    }
  },
}
