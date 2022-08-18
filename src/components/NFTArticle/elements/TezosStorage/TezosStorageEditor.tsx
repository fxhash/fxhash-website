import style from "./TezosStorageEditor.module.scss"
import editorStyle from "../../SlateEditor/UI/EditorStyles.module.scss"
import cs from "classnames"
import { forwardRef, PropsWithChildren, useCallback, useState } from "react"
import { ITezosStoragePointer } from "../../../../types/TezosStorage"
import { TezosStorageSettings } from "./TezosStorageSettings"
import { ReactEditor, useSlateStatic } from "slate-react"
import { Transforms } from "slate"
import { BlockParamsModal } from "../../SlateEditor/UI/BlockParamsModal"
import { TezosStorageDisplay } from "./TezosStorageDisplay"

export interface TezosStorageProps extends PropsWithChildren<ITezosStoragePointer> {
  element: any
}
const TezosStorageEditor = forwardRef<HTMLDivElement, TezosStorageProps>(({
  contract,
  path,
  storage_type,
  spec,
  data_spec,
  value_path,
  element,
  children,
}, ref) => {
  const editor = useSlateStatic()
  const nodePath = ReactEditor.findPath(editor, element)

  const [showModal, setShowModal] = useState<boolean>(false)

  // if there is no contract, the block isn't valid
  const empty = !contract

  // update the element with new values
  const update = useCallback((element: any) => {
    Transforms.setNodes(editor, element, {
      at: nodePath
    })
  }, [nodePath, element])

  return (
    <div ref={ref}>
      <div contentEditable={false}>
        {empty ? (
          <button
            type="button"
            className={cs(editorStyle.import_btn)}
            onClick={(event) => {
              setShowModal(true)
              event.preventDefault()
              event.stopPropagation()
            }}
          >
            <i className="fa-solid fa-hexagon-vertical-nft" aria-hidden/>
            <span>
              Insert fxhash content
            </span>
          </button>
        ):(
          <TezosStorageDisplay
            contract={contract}
            path={path}
            storage_type={storage_type}
            spec={spec}
            data_spec={data_spec}
            value_path={value_path}
          />
        )}
      </div>

      {showModal && (
        <BlockParamsModal
          onClose={() => setShowModal(false)}
        >
          <TezosStorageSettings
            element={element}
            onEdit={element => {
              update(element)
              setShowModal(false)
            }}
          />
        </BlockParamsModal>
      )}
      <div style={{ display: "none" }}>
        {children}
      </div>
    </div>
  )
})

TezosStorageEditor.displayName = 'TezosStorage'
export default TezosStorageEditor
