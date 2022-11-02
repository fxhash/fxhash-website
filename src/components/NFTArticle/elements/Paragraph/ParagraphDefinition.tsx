import { IArticleBlockDefinition } from "../../../../types/ArticleEditor/BlockDefinition"

export const paragraphDefinition: IArticleBlockDefinition<any> = {
  name: "Paragraph",
  icon: <i className="fa-solid fa-paragraph" aria-hidden />,
  buttonInstantiable: true,
  render: ({ attributes, element, children }) => (
    <p {...attributes}>{children}</p>
  ),
  hasUtilityWrapper: true,
  instanciateElement: (text?: string) => ({
    type: "paragraph",
    children: [
      {
        text: text || "",
      },
    ],
  }),
}
