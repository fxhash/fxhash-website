import { CodeEditor } from "./CodeEditor"
import { CodeAttributeSettings } from "./CodeAttributeSettings"
import { IArticleBlockDefinition } from "../../../../types/ArticleEditor/BlockDefinition"

interface InstanciateCodeOpts {
  lang?: string
}
export const codeDefinition: IArticleBlockDefinition<InstanciateCodeOpts> = {
  name: "Code",
  icon: <i className="fa-solid fa-code" aria-hidden />,
  buttonInstantiable: true,
  render: CodeEditor,
  hasUtilityWrapper: true,
  instanciateElement: (opts = { lang: "js" }) => ({
    type: "code",
    lang: opts.lang,
    children: [
      {
        text: "",
      },
    ],
  }),
  editAttributeComp: CodeAttributeSettings,
}
