import style from "./Tabs.module.scss"
import cs from "classnames"
import React, {
  HTMLAttributes,
  PropsWithChildren,
  useEffect,
  useRef,
} from "react"
import Link, { LinkProps } from "next/link"
import { onKeydownAccessibleButton } from "../../utils/accessibility"

const DefaultTabWrapper = ({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div {...props}>{children}</div>
)
type LinkTabWrapperProps = PropsWithChildren<LinkProps> &
  HTMLAttributes<HTMLAnchorElement>
export const LinkTabWrapper = ({
  children,
  onClick,
  ...props
}: LinkTabWrapperProps) => (
  <Link {...props}>
    <a className={props.className} onClick={onClick}>
      {children}
    </a>
  </Link>
)

export type TabDefinition = {
  key?: string
  name: string
  props?: any
}
type TabsLayout =
  | "full-width"
  | "fixed-size"
  | "subtabs"
  | "subtabs-vertical"
  | "fixed-size-narrow"

interface TabProps {
  layout: TabsLayout
  definition: TabDefinition
  active: boolean
  wrapperComponent?: any
  onClick?: () => void
}
export function Tab({
  definition,
  layout,
  active,
  wrapperComponent,
  onClick,
}: TabProps) {
  const Wrapper = wrapperComponent || DefaultTabWrapper

  return (
    <Wrapper
      className={cs(style.tab, style[`tab-${layout}`], {
        [style.active]: active,
        ["tab-active"]: active,
      })}
      onClick={onClick}
      {...definition.props}
      role="button"
      tabIndex={0}
      onKeyDown={onKeydownAccessibleButton(onClick)}
    >
      {definition.name}
    </Wrapper>
  )
}

/** tab routing by key instead of idx **/
type IsTabActiveHandler = (
  def: TabDefinition,
  activeIdx: number | string,
  tabIdx: number
) => boolean
export const checkIsTabKeyActive: IsTabActiveHandler = (def, activeIdx) =>
  def.key === activeIdx
export interface Props {
  className?: string
  tabsLayout?: TabsLayout
  tabDefinitions: TabDefinition[]
  activeIdx: number | string
  tabsClassName?: string
  contentClassName?: string
  tabWrapperComponent?: React.ReactNode
  onClickTab?: (index: number, def: TabDefinition) => void
  checkIsTabActive?: IsTabActiveHandler
}
/**
 * The Tabs module takes a list of Tab Definitions, an active tab index N, and only renders the
 * N-th component in its children list. Component is uncontrolled to allow for Controller
 * components to usee it higher in the hierarchy
 */
export function Tabs({
  className,
  tabDefinitions,
  tabsLayout = "full-width",
  activeIdx,
  checkIsTabActive,
  tabsClassName,
  onClickTab,
  contentClassName,
  tabWrapperComponent,
  children,
}: PropsWithChildren<Props>) {
  const refContainer = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const elContainer = refContainer.current
    if (elContainer) {
      const elNav = elContainer.querySelector("nav")
      const elActive: HTMLElement | null =
        elContainer.querySelector(".tab-active")
      if (
        elNav &&
        elActive &&
        elActive.offsetLeft + elActive.clientWidth > elContainer.clientWidth
      ) {
        const paddingLeft = window
          ? parseFloat(
              window
                .getComputedStyle(elNav, null)
                .getPropertyValue("padding-left")
            )
          : 0
        elContainer.scrollLeft =
          elActive.offsetLeft - elContainer.offsetLeft - paddingLeft
      }
    }
  }, [])
  return (
    <div
      ref={refContainer}
      className={cs(style.container, style[`layout-${tabsLayout}`], className)}
    >
      <nav className={cs(tabsClassName)}>
        {tabDefinitions.map((def, idx) => {
          const isActive = checkIsTabActive
            ? checkIsTabActive(def, activeIdx, idx)
            : idx === activeIdx
          return (
            <Tab
              key={idx}
              active={isActive}
              definition={def}
              layout={tabsLayout}
              wrapperComponent={tabWrapperComponent}
              onClick={() => onClickTab?.(idx, def)}
            />
          )
        })}
      </nav>
    </div>
  )
}
