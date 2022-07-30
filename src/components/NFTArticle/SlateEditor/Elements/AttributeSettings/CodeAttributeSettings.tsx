import cs from "classnames"
import { ReactNode } from "react"
import { ContextualMenuItems } from "../../../../Menus/ContextualMenuItems"
import { TEditAttributeComp } from "../Blocks"

interface ILanguageEntry {
  name: string
  value: string
  icon: ReactNode
}

const languages: ILanguageEntry[] = [
  {
    name: "Javascript",
    value: "js",
    icon: <i className="fa-brands fa-square-js" aria-hidden />
  },
  {
    name: "CSS",
    value: "css",
    icon: <i className="fa-brands fa-css3-alt" aria-hidden />
  },
]

export const CodeAttributeSettings: TEditAttributeComp = ({
  element,
  onEdit,
}) => {
  return (
    <ContextualMenuItems>
      {languages.map((language) => (
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