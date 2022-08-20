import { useMemo } from "react"
import { BlockDefinitions, EArticleBlocks, InstantiableArticleBlocksList } from "../Blocks"
import { BlockMenu } from "./BlockMenu"
import { ContextualMenuItems } from "../../../Menus/ContextualMenuItems"

interface Props {
  onClose: () => void
  onAddBlock: (element: any) => void
  className?: string
}
export function AddBlock({
  onClose,
  onAddBlock,
  className,
}: Props) {
  // a list of the button-instantiable elements
  const instantiable = useMemo(() => {
    return InstantiableArticleBlocksList.map(
      type => BlockDefinitions[type as EArticleBlocks]
    ).filter(
      definition => !!definition.buttonInstantiable
    )
  }, [])

  return (
    <BlockMenu
      className={className}
      onClose={onClose}
    >
      <ContextualMenuItems>
        {instantiable.map((def) => (
          <button
            key={def.name}
            type="button"
	    onClick={() => onAddBlock(def.instanciateElement!())}
          >
            {def.icon}
            <span>{def.name}</span>
          </button>
        ))}
      </ContextualMenuItems>
    </BlockMenu>
  )
}
