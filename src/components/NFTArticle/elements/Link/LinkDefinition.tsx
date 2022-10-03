import { IArticleBlockDefinition } from "../../../../types/ArticleEditor/BlockDefinition"
import { sanitizeUrl } from "../../../../utils/url"

export const linkDefinition: IArticleBlockDefinition<any> = {
  name: "Link",
  icon: <i className="fa-solid fa-link" aria-hidden />,
  render: ({ attributes, element, children }) => {
    return (
      <a
        {...attributes}
        href={sanitizeUrl(element.url as string)}
        title={element.title as string}
      >
        {children}
      </a>
    )
  },
  hasUtilityWrapper: false,
}
