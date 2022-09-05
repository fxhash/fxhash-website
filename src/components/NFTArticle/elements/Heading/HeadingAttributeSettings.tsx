import cs from "classnames"
import { ContextualMenuItems } from "../../../Menus/ContextualMenuItems"
import { TEditAttributeComp } from "../../../../types/ArticleEditor/BlockDefinition";

export const HeadingAttributeSettings: TEditAttributeComp = ({
  element,
  onEdit,
}) => {
  return (
    <ContextualMenuItems>
      {[...Array(6)].map((_, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onEdit({
            depth: idx+1
          })}
          className={cs({
            selected: element.depth === idx+1
          })}
        >
          <i className={`fa-regular fa-h${idx+1}`} aria-hidden/>
          <span>Heading {idx+1}</span>
        </button>
      ))}
    </ContextualMenuItems>
  )
}
