import { FunctionComponent, PropsWithChildren } from "react"

/**
 * The attribute edition can be rendered in a contextual menu or in a modal
 * popin. This type provides a generic interface to define such components.
 */
export type TAttributesEditorWrapperProps = {
  onClose: () => void
  className: string
}
export type TAttributesEditorWrapper = FunctionComponent<
  PropsWithChildren<TAttributesEditorWrapperProps>
>