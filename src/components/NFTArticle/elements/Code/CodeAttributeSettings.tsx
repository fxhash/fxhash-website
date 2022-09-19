import cs from "classnames"
import { ContextualMenuItems } from "../../../Menus/ContextualMenuItems"
import { TEditAttributeComp } from "../../../../types/ArticleEditor/BlockDefinition"
import { codeEditorLangs } from "./CodeLanguages"

export const CodeAttributeSettings: TEditAttributeComp = ({
  element,
  onEdit,
}) => {
  return (
    <ContextualMenuItems>
      {codeEditorLangs.map((language) => (
        <button
          key={language.value}
          type="button"
          onClick={() =>
            onEdit({
              lang: language.value,
            })
          }
          className={cs({
            selected: element.lang === language.value,
          })}
        >
          {language.icon}
          <span>{language.name}</span>
        </button>
      ))}
    </ContextualMenuItems>
  )
}
