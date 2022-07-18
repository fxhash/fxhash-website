import style from "./RenderElements.module.scss"
import cs from "classnames"
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react"
import React, { PropsWithChildren, useMemo, useState } from "react"
import { AddBlock } from "../Utils/AddBlock"
import { getArticleBlockDefinition } from "./Blocks"
import { Path, Transforms } from "slate"
import { BlockExtraMenu } from "../Utils/BlockExtraMenu"
import { BlockMenu } from "../Utils/BlockMenu"
import { TAttributesEditorWrapper } from "../../../../types/ArticleEditor/ArticleEditorBlocks"
import { TEditNodeFn, TEditNodeFnFactory } from "../../../../types/ArticleEditor/Transforms"


interface IEditableElementWrapperProps {
  element: any
}

// default function to create an edit node function
const defaultEditNodeFactory: TEditNodeFnFactory = (editor, element, path) =>
(update) => {
  Transforms.setNodes(editor, update, {
    at: path
  })
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

  // get the definition corresponding to the element type
  const definition = useMemo(
    () => getArticleBlockDefinition(element.type),
    [element.type]
  )

  const ParametersWrapper = useMemo<TAttributesEditorWrapper>(
    () => definition.editAttributeWrapper || BlockMenu,
    [definition]
  )

  // create the edit node function based on the element definition
  // (use the definition's one or the default one if none is given)
  const editNode = useMemo<TEditNodeFn>(() => {
    const factory = definition.onEditNodeFactory || defaultEditNodeFactory
    return factory(editor, element, path)
  }, [definition, editor, element, path])

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
          <ParametersWrapper
            onClose={() => setShowSettings(false)}
            className={cs(style.add_block)}
          >
            <definition.editAttributeComp
              element={element}
              onEdit={!definition.hideSettingsAfterUpdate 
                ? editNode 
                : (update) => {
                  editNode(update)
                  setShowSettings(false)
                }
              }
            />
          </ParametersWrapper>
        </div>
      )}
    </div>
  )
}

/**
 * Acts as a wrapper around the <EditableElement> component and augments it with
 * some utilities.
 */
export function RenderElements(props: RenderElementProps) {
  const definition = useMemo(
    () => getArticleBlockDefinition(props.element.type),
    [props.element.type]
  )
  const Wrapper = useMemo(
    () => definition.hasUtilityWrapper 
      ? ({ children }: PropsWithChildren<any>) => (
        <EditableElementWrapper element={props.element}>
          {children}
        </EditableElementWrapper>
      ): React.Fragment, 
    [definition, props.element]
  )
  
  return (
    <Wrapper>
      {definition.render(props)}
    </Wrapper>
  )
}
