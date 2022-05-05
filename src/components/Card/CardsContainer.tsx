import style from "./CardsContainer.module.scss"
import cs from "classnames"
import {forwardRef, HTMLAttributes, PropsWithChildren} from "react"

interface Props extends HTMLAttributes<HTMLDivElement> {
  addExtraDivs?: boolean,
}

export const CardsContainer = forwardRef<HTMLDivElement, Props>(({
  children,
  addExtraDivs,
  ...props
}: PropsWithChildren<Props>, ref) => {
  return (
    <div {...props} className={cs(style.container, props.className)} ref={ref}>
      {children}
      {addExtraDivs && (
        <>
          <div/>
          <div/>
          <div/>
          <div/>
          <div/>
          <div/>
          <div/>
          <div/>
        </>
      )}
    </div>
  )
});
CardsContainer.displayName = 'CardsContainer';
