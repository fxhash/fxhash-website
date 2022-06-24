import style from "./RenderElements.module.scss"
import cs from "classnames"
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react"
import React, { PropsWithChildren, useMemo, useState } from "react"
import { AddBlock } from "../Utils/AddBlock"
import { getArticleBlockDefinition } from "./Blocks"
import { Path, Transforms } from "slate"
import { BlockExtraMenu } from "../Utils/BlockExtraMenu"
import { BlockMenu } from "../Utils/BlockMenu"


interface IEditableElementWrapperProps {
  element: any
}

/**
 * A generic wrapper which adds some utility components on top of the 
 * Editable Blocks. 
 */
function EditableElementWrapper({
  element,
  children,
}: PropsWithChildren<IEditableElementWrapperProps>) {
  const [showAddBlock, setShowAddBlock] = useState<boolean>(false)
  const [showExtraMenu, setShowExtraMenu] = useState<boolean>(false)
  const [showSettings, setShowSettings] = useState<boolean>(false)

  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, element)

  const addBlock = (element: any) => {
    const target = Path.next(path)
    Transforms.insertNodes(editor, element, {
      at: target
    })
    setShowAddBlock(false)
  }

  const deleteNode = () => {
    Transforms.removeNodes(editor, {
      at: path
    })
  }

  const editNode = (element: any) => {
    Transforms.setNodes(editor, element, {
      at: path
    })
  }

  const definition = useMemo(
    () => getArticleBlockDefinition(element.type),
    [element.type]
  )

  return (
    <div
      className={cs(style.element_wrapper, {
        [style.opened]: showAddBlock || showExtraMenu
      })}
    >
      {children}
      <div className={cs(style.buttons)}>
        {definition.editAttributeComp ? (
          <button
            type="button"
            contentEditable={false}
            onClick={() => setShowSettings(true)}
            tabIndex={-1}
          >
            <i className="fa-solid fa-gear" aria-hidden/>
          </button>
        ):(
          <div/>
        )}
        <button
          type="button"
          contentEditable={false}
          onClick={() => setShowAddBlock(true)}
          tabIndex={-1}
        >
          <i className="fa-solid fa-plus" aria-hidden/>
        </button>
        <button
          type="button"
          contentEditable={false}
          onClick={() => setShowExtraMenu(true)}
          tabIndex={-1}
        >
          <i className="fa-solid fa-ellipsis" aria-hidden/>
        </button>
      </div>
      {showAddBlock && (
        <>
          <div 
            className={cs(style.add_block_wrapper)}
            contentEditable={false}
          >
            <AddBlock
              onClose={() => setShowAddBlock(false)}
              onAddBlock={addBlock}
              className={cs(style.add_block)}
            />
          </div>
          <div
            contentEditable={false}
            className={cs(style.sep)}
          />
        </>
      )}
      {showExtraMenu && (
        <div 
          className={cs(style.add_block_wrapper)}
          contentEditable={false}
        >
          <BlockExtraMenu
            onClose={() => setShowExtraMenu(false)}
            onDeleteNode={deleteNode}
            className={cs(style.add_block)}
          />
        </div>
      )}
      {definition.editAttributeComp && showSettings && (
        <div 
          className={cs(style.add_block_wrapper)}
          contentEditable={false}
        >
          <BlockMenu
            onClose={() => setShowSettings(false)}
            className={cs(style.add_block)}
          >
            {definition.editAttributeComp({
              element: element,
              onEdit: editNode,
            })}
          </BlockMenu>
        </div>
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
    <Wrapper element={props.element}>
      {definition.render(props)}
    </Wrapper>
  )
}