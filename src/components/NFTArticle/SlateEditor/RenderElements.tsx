import style from "./RenderElements.module.scss"
import cs from "classnames"
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react"
import React, {
  PropsWithChildren,
  DragEvent,
  useMemo,
  useRef,
  useState,
} from "react"
import { AddBlock } from "./UI/AddBlock"
import { getArticleBlockDefinition } from "./Blocks"
import { Path, Transforms, Node } from "slate"
import { BlockExtraMenu } from "./UI/BlockExtraMenu"
import { BlockMenu } from "./UI/BlockMenu"
import {
  TEditNodeFn,
  TEditNodeFnFactory,
} from "../../../types/ArticleEditor/Transforms"
import { withStopPropagation } from "../../../utils/events"
import { TAttributesEditorWrapper } from "../../../types/ArticleEditor/BlockDefinition"

interface IEditableElementWrapperProps {
  element: any
}

// default function to create an edit node function
const defaultEditNodeFactory: TEditNodeFnFactory =
  (editor, element, path) => (update) => {
    Transforms.setNodes(editor, update, {
      at: path,
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
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [insertAbove, setInsertAbove] = useState<boolean>(false)

  const draggableRef = useRef(null)
  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, element)

  // when the selection changes, we check if the focus is inside this block
  const selected = useMemo(() => {
    if (editor.selection) {
      // the first element in any path is the top-most element
      if (editor.selection.focus.path[0] === path[0]) {
        return true
      }
    }
    return false
  }, [editor.selection, path])

  const addBlock = (element: any) => {
    const target = Path.next(path)
    Transforms.insertNodes(editor, element, {
      at: target,
    })
    setShowAddBlock(false)
    // focus the block except if the definition says otherwise
    const definition = getArticleBlockDefinition(element.type)
    if (!definition || !definition.preventAutofocusTrigger) {
      // in order to retrieve the DOMNode and restore
      // the selection correctly, we have to wait
      setTimeout(() => {
        ReactEditor.focus(editor)
        const path = ReactEditor.findPath(editor, element)
        const [, lastLeafPath] = Node.last(editor, path)
        Transforms.select(editor, lastLeafPath)
      })
    }
  }

  const handleStartDragging = () => {
    if (!draggableRef.current) return
    ;(draggableRef.current as HTMLElement).setAttribute("draggable", "true")
    setIsDragging(true)
  }

  const handleEndDragging = () => {
    if (!draggableRef.current) return
    ;(draggableRef.current as HTMLElement).setAttribute("draggable", "false")
    setIsDragging(false)
  }

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const domElement = (e.target as HTMLElement).children[0] as HTMLElement
    if (!domElement) return
    ReactEditor.deselect(editor)
    const fromPath = ReactEditor.findPath(editor, element)
    e.dataTransfer.setDragImage(domElement, domElement.offsetWidth, 0)
    e.dataTransfer.setData("text/plain", JSON.stringify(fromPath))
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    const elemPath = ReactEditor.findPath(editor, element)
    // For the first block we want to be able to drop elements above it
    if (elemPath[0] === 0) {
      const { height, top } = (e.target as HTMLElement).getBoundingClientRect()
      if (e.clientY < top + height / 2) {
        setInsertAbove(true)
      } else {
        setInsertAbove(false)
      }
    } else if (insertAbove) {
      setInsertAbove(false)
    }
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    const data = e.dataTransfer.getData("text/plain")
    if (!data) return
    const at = JSON.parse(e.dataTransfer.getData("text/plain")) as Path
    const targetPath = ReactEditor.findPath(editor, element)
    const insertAfter = !insertAbove && at[0] > targetPath[0]
    Transforms.moveNodes(editor, {
      at,
      to: insertAfter ? Path.next(targetPath) : targetPath,
    })
  }

  const handleMoveDown = () => {
    const at = ReactEditor.findPath(editor, element)
    if (at[0] === editor.children.length - 1) return
    const to = Path.next(at)
    Transforms.moveNodes(editor, { at, to })
    Transforms.select(editor, to)
    Transforms.collapse(editor)
  }

  const handleMoveUp = () => {
    const at = ReactEditor.findPath(editor, element)
    if (at[0] === 0) return
    const to = Path.previous(at)
    Transforms.moveNodes(editor, { at, to })
    Transforms.select(editor, to)
    Transforms.collapse(editor)
  }

  const deleteNode = () => {
    Transforms.removeNodes(editor, {
      at: path,
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
      ref={draggableRef}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnd={handleEndDragging}
      onDrop={handleDrop}
      className={cs(style.element_wrapper, {
        [style.opened]: showAddBlock || showExtraMenu,
        [style.buttons_visible]: selected,
        [style.dragOver]: isDragOver,
        [style.insertAbove]: insertAbove,
      })}
    >
      {children}
      <div contentEditable={false} className={cs(style.buttons)}>
        {definition.editAttributeComp ? (
          <button
            type="button"
            contentEditable={false}
            onClick={withStopPropagation(() => setShowSettings(true))}
            tabIndex={-1}
          >
            <i className="fa-solid fa-gear" aria-hidden />
          </button>
        ) : (
          <div />
        )}
        <button
          className={style.add_button}
          type="button"
          contentEditable={false}
          onClick={withStopPropagation(() => setShowAddBlock(true))}
        >
          <i className="fa-solid fa-plus" aria-hidden />
        </button>
        <button
          type="button"
          contentEditable={false}
          onClick={withStopPropagation(() => setShowExtraMenu(true))}
          tabIndex={-1}
        >
          <i className="fa-solid fa-ellipsis" aria-hidden />
        </button>
        <button
          onPointerDown={handleStartDragging}
          onPointerUp={handleEndDragging}
          type="button"
          contentEditable={false}
          tabIndex={-1}
        >
          <i className="fa-solid fa-grip-dots" />
        </button>
        <button
          type="button"
          contentEditable={false}
          tabIndex={-1}
          onClick={handleMoveUp}
        >
          <i className="fa-solid fa-arrow-up" />
        </button>
        <button
          type="button"
          contentEditable={false}
          tabIndex={-1}
          onClick={handleMoveDown}
        >
          <i className="fa-solid fa-arrow-down" />
        </button>
      </div>
      {showAddBlock && (
        <>
          <div className={cs(style.add_block_wrapper)} contentEditable={false}>
            <AddBlock
              onClose={() => setShowAddBlock(false)}
              onAddBlock={addBlock}
              className={cs(style.add_block)}
            />
          </div>
          <div contentEditable={false} className={cs(style.sep)} />
        </>
      )}
      {showExtraMenu && (
        <div className={cs(style.add_block_wrapper)} contentEditable={false}>
          <BlockExtraMenu
            onClose={() => setShowExtraMenu(false)}
            onDeleteNode={deleteNode}
            className={cs(style.add_block)}
          />
        </div>
      )}
      {definition.editAttributeComp && showSettings && (
        <div className={cs(style.add_block_wrapper)} contentEditable={false}>
          <ParametersWrapper
            onClose={() => setShowSettings(false)}
            className={cs(style.add_block)}
          >
            <definition.editAttributeComp
              element={element}
              onEdit={
                !definition.hideSettingsAfterUpdate
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
  return definition.hasUtilityWrapper ? (
    <EditableElementWrapper element={props.element}>
      {definition.render(props)}
    </EditableElementWrapper>
  ) : (
    <>{definition.render(props)}</>
  )
}
