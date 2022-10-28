import { IArticleElementProcessor } from "../../../../types/ArticleEditor/Processor"

export const embedProcessor: IArticleElementProcessor = {
  htmlTagName: "embed-media",
  htmlAttributes: ["href", "editable"],
  transformMdhastToComponent: (node, properties) => {
    if (!properties.href) return null
    return {
      href: properties.href,
      editable: false,
    }
  },
}
