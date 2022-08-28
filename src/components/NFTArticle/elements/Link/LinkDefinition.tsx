import { IArticleBlockDefinition } from "../../../../types/ArticleEditor/BlockDefinition";

export const linkDefinition: IArticleBlockDefinition<any> = {
  name: "Link",
  icon: <i className="fa-solid fa-link" aria-hidden/>,
  render: ({ attributes, element, children }) => (
    <a
      {...attributes}
      href={element.url as string}
      title={element.title as string}
    >
      {children}
    </a>
  ),
  hasUtilityWrapper: false,
}
