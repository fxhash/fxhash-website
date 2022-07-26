import style from "./TezosStorageEditor.module.scss"
import editorStyle from "../Utils/EditorStyles.module.scss"
import cs from "classnames"
import { forwardRef, memo, PropsWithChildren, useCallback, useState } from "react"
import { ITezosStoragePointer, OptionalTezosStoragePointerKeys } from "../../../../types/TezosStorage"
import { NFTArticleElementComponent } from "../../../../types/Article"
import { TezosStorageSettings } from "./AttributeSettings/TezosStorageSettings"
import { ReactEditor, useSlateStatic } from "slate-react"
import { Transforms } from "slate"
import { BlockParamsModal } from "../Utils/BlockParamsModal"
import { TezosStorage } from "../../elements/TezosStorage"

export interface TezosStorageProps extends PropsWithChildren<ITezosStoragePointer> {
  element: any
}
const TezosStorageEditor: NFTArticleElementComponent<TezosStorageProps> = forwardRef<HTMLDivElement, TezosStorageProps>(({ 
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
          <TezosStorage
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

TezosStorageEditor.getPropsFromNode = (node, properties) => {
  const props: Partial<ITezosStoragePointer> = {
    contract: properties.contract,
    path: properties.path,
  }
  for (const K of OptionalTezosStoragePointerKeys) {
    if (properties[K]) {
      props[K] = properties[K]
    }
  }
  return props as any
}

TezosStorageEditor.fromSlateToMarkdown = (properties) => {
  const props: Partial<ITezosStoragePointer> = {
    contract: properties.contract,
    path: properties.path,
  }
  for (const K of OptionalTezosStoragePointerKeys) {
    if (properties[K]) {
      props[K] = properties[K]
    }
  }
  return props as any
}

export default memo(TezosStorageEditor)