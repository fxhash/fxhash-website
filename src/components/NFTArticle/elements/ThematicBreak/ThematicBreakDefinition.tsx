import { ThematicBreakDisplay } from "./ThematicBreakDisplay";
import { IArticleBlockDefinition } from "../../../../types/ArticleEditor/BlockDefinition";

export const thematicBreakDefinition: IArticleBlockDefinition<any> = {
  name: "Horizontal break",
  icon: <i className="fa-solid fa-horizontal-rule" aria-hidden />,
  render: ThematicBreakDisplay,
  instanciateElement: () => ({
    type: "thematicBreak",
    children: [{
      text: ""
    }],
  }),
  buttonInstantiable: true,
  hasUtilityWrapper: true,
}
