import { IArticleBlockDefinition } from "../../../../types/ArticleEditor/BlockDefinition"
import { EBreakBehavior } from "../../SlateEditor/Plugins/SlateBreaksPlugin"
import { HeadingAttributeSettings } from "./HeadingAttributeSettings"

export const headingDefinition: IArticleBlockDefinition<any> = {
  name: "Heading",
  icon: <i className="fa-solid fa-heading" aria-hidden />,
  buttonInstantiable: true,
  render: ({ attributes, element, children }) => {
    switch (element.depth) {
      case 1:
        return <h1 {...attributes}>{children}</h1>
      case 2:
        return <h2 {...attributes}>{children}</h2>
      case 3:
        return <h3 {...attributes}>{children}</h3>
      case 4:
        return <h4 {...attributes}>{children}</h4>
      case 5:
        return <h5 {...attributes}>{children}</h5>
      case 6:
        return <h6 {...attributes}>{children}</h6>
      default:
        break
    }
  },
  insertBreakBehavior: EBreakBehavior.insertParagraph,
  hasUtilityWrapper: true,
  instanciateElement: () => ({
    type: "heading",
    depth: 1,
    children: [
      {
        text: "",
      },
    ],
  }),
  editAttributeComp: HeadingAttributeSettings,
}
