import { BlockquoteEditor } from "./BlockquoteEditor";
import { IArticleBlockDefinition } from "../../../../types/ArticleEditor/BlockDefinition";

export const blockquoteDefinition: IArticleBlockDefinition<any> = {
  name: "Quote",
  icon: <i className="fa-solid fa-quotes" aria-hidden/>,
  buttonInstantiable: true,
  render: BlockquoteEditor,
  hasUtilityWrapper: true,
  instanciateElement: ({text=""}: {text?: string} = {}) => ({
    type: "blockquote",
    children: [{
      text
    }]
  })
}
