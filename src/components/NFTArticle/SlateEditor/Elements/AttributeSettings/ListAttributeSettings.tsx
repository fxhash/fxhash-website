import cs from "classnames"
import { ContextualMenuItems } from "../../../../Menus/ContextualMenuItems"
import { TEditAttributeComp } from "../Blocks"

export const ListAttributeSettings: TEditAttributeComp = ({
  element,
  onEdit,
}) => {
  return (
    <ContextualMenuItems>
        <button
          type="button"
          onClick={() => onEdit({
            ordered: false
          })}
          className={cs({
            selected: element.ordered === false
          })}
        >
          <i className="fa-solid fa-list" aria-hidden/>
          <span>Bulleted</span>
        </button>
        <button
          type="button"
          onClick={() => onEdit({
            ordered: true
          })}
          className={cs({
            selected: element.ordered === true
          })}
        >
          <i className="fa-solid fa-list-ol" aria-hidden/>
          <span>Ordered</span>
        </button>
    </ContextualMenuItems>
  )
}