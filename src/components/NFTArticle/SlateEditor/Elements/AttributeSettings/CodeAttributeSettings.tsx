import cs from "classnames"
import { ReactNode } from "react"
import { ContextualMenuItems } from "../../../../Menus/ContextualMenuItems"
import { TEditAttributeComp } from "../Blocks"

interface ILanguageEntry {
  name: string
  value: string
  icon: ReactNode
}

export const codeEditorLangs: ILanguageEntry[] = [
  {
    name: "Javascript",
    value: "js",
    icon: <i className="fa-brands fa-square-js" aria-hidden />
  },
  {
    name: "GLSL",
    value: "glsl",
    icon: <i className="fa-regular fa-file-code" aria-hidden />
  },
  {
    name: "HTML",
    value: "html",
    icon: <i className="fa-regular fa-file-code" aria-hidden />
  },
  {
    name: "CSS",
    value: "css",
    icon: <i className="fa-brands fa-css3-alt" aria-hidden />
  },
  {
    name: "JSON",
    value: "json",
    icon: <i className="fa-solid fa-brackets-curly" aria-hidden />
  },
  {
    name: "Java",
    value: "java",
    icon: <i className="fa-regular fa-file-code" aria-hidden />
  },
]

export function getCodeEditorLang(value: string): ILanguageEntry {
  return codeEditorLangs.find(entry => entry.value === value) || codeEditorLangs[0]
}

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
          onClick={() => onEdit({
            lang: language.value,
          })}
          className={cs({
            selected: element.lang === language.value
          })}
        >
          {language.icon}
          <span>{language.name}</span>
        </button>

      ))}
    </ContextualMenuItems>
  )
}