import { IArticleBlockDefinition } from "../../../../types/ArticleEditor/BlockDefinition";
import style from "../../NFTArticle.module.scss";
import { BlockKatexEditor } from "./BlockKatexEditor";

export const mathDefinition: IArticleBlockDefinition<any> = {
  name: "Math",
  icon: <i className="fa-solid fa-function" aria-hidden/>,
  buttonInstantiable: true,
  render: ({ attributes, element, children }) => (
    <div className={style.article_wrapper_container} {...attributes}>
      {children}
      <BlockKatexEditor slateElement={element}/>
    </div>
  ),
  hasUtilityWrapper: true,
  instanciateElement: () => ({
    type: "math",
    math: "",
    children: [{
      text: ""
    }]
  })
}

export const inlineMathDefinition: IArticleBlockDefinition<any> = {
  name: "Math",
  icon: <i className="fa-solid fa-function" aria-hidden/>,
  render: ({ attributes, element, children }) => (
    <span contentEditable={false}>
      inline math
    </span>
  ),
  hasUtilityWrapper: false,
}
