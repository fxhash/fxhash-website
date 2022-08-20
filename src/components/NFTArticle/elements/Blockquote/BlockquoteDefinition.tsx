import { BlockquoteDisplay } from "./BlockquoteDisplay";
import { IArticleBlockDefinition } from "../../../../types/ArticleEditor/BlockDefinition";

export const blockquoteDefinition: IArticleBlockDefinition<any> = {
  name: "Quote",
  icon: <i className="fa-solid fa-quotes" aria-hidden/>,
  buttonInstantiable: true,
  render: BlockquoteDisplay,
  hasUtilityWrapper: true,
  instanciateElement: () => ({
    type: "blockquote",
    children: [{
      text: ""
    }]
  })
}
