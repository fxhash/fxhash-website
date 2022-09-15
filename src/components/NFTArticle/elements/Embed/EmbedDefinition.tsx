import { IArticleBlockDefinition } from "../../../../types/ArticleEditor/BlockDefinition";
import style from "../../NFTArticle.module.scss";
import Embed from "./Embed";

export const embedDefinition: IArticleBlockDefinition<any> = {
  name: "Embed media",
  icon: <i className="fa-brands fa-youtube" aria-hidden/>,
  buttonInstantiable: true,
  render: ({ attributes, element, children }) => (
    <div className={style.article_wrapper_container}>
      <Embed
        slateElement={element}
        slateAttributes={attributes}
        href={element.href}
        editable
      >
        {children}
      </Embed>
    </div>
  ),
  hasUtilityWrapper: true,
  instanciateElement: () => ({
    type: "embed-media",
    href: "",
    children: [{
      text: ""
    }],
  }),
  preventAutofocusTrigger: true,
}
