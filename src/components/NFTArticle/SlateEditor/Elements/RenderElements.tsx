import style from "./RenderElements.module.scss"
import cs from "classnames"
import { RenderElementProps } from "slate-react"
import React, { PropsWithChildren, useMemo, useState } from "react"
import { AddBlock } from "../Utils/AddBlock"
import { getArticleBlockDefinition } from "./Blocks"


/**
 * A generic wrapper which adds some utility components on top of the 
 * Editable Blocks. 
 */
function EditableElementWrapper({
  children
}: PropsWithChildren<any>) {
  const [showAddBlock, setShowAddBlock] = useState<boolean>(false)

  return (
    <div
      className={cs(style.element_wrapper, {
        [style.opened]: showAddBlock
      })}
    >
      {children}
      <button
        type="button"
        contentEditable={false}
        className={cs(style.btn_add)}
        onClick={() => setShowAddBlock(!showAddBlock)}
        tabIndex={-1}
      >
        <i className="fa-solid fa-plus" aria-hidden/>
      </button>
      {showAddBlock && (
        <>
          <div 
            className={cs(style.add_block_wrapper)}
            contentEditable={false}
          >
            <AddBlock
              onClose={() => setShowAddBlock(false)}
              className={cs(style.add_block)}
            />
          </div>
          <div
            contentEditable={false}
            className={cs(style.sep)}
          />
        </>
      )}
    </div>
  )
}

/**
 * Acts as a wrapper around the <EditableElement> component and augments it with
 * some utilities.
 */
export function renderElements(props: RenderElementProps) {
  const definition = useMemo(
    () => getArticleBlockDefinition(props.element.type),
    [props.element.type]
  )
  const Wrapper = useMemo(
    () => definition.hasUtilityWrapper 
      ? EditableElementWrapper 
      : React.Fragment, 
    [definition]
  )

  return (
    <Wrapper>
      {definition.render(props)}
    </Wrapper>
  )
}