import { BlockMenu } from "./BlockMenu"
import { ContextualMenuItems } from "../../../Menus/ContextualMenuItems"
import cs from "classnames"

interface Props {
  onClose: () => void
  onDeleteNode: () => void
  className?: string
}
export function BlockExtraMenu({
  onClose,
  onDeleteNode,
  className,
}: Props) {
  return (
    <BlockMenu
      onClose={onClose}
      className={cs(className)}
    >
      <ContextualMenuItems>
        <button
          type="button"
          onClick={onDeleteNode}
        >
          <i className="fa-solid fa-trash-can" aria-hidden/>
          <span>Delete block</span>
        </button>
      </ContextualMenuItems>
    </BlockMenu>
  )
}