import style from "./Tabs.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"
import { FunctionComponent, HTMLAttributes } from "react-router/node_modules/@types/react"


export type TabDefinition = {
  name: string,
  props?: any
}
type TabsLayout = "full-width" | "fixed-size"

interface TabProps {
  layout: TabsLayout
  definition: TabDefinition
  active: boolean
  wrapperComponent?: any
}

const DefaultTabWrapper: FunctionComponent<HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
  <div {...props}>{ children }</div>
)

export function Tab({ definition, layout, active, wrapperComponent }: TabProps) {
  const Wrapper = wrapperComponent || DefaultTabWrapper

  return (
    <Wrapper 
      className={cs(style.tab, style[`tab-${layout}`], { 
        [style.active]: active
      })}
      {...definition.props}
    >
      { definition.name }
    </Wrapper>
  )
}

interface Props {
  tabsLayout?: TabsLayout
  tabDefinitions: TabDefinition[]
  activeIdx: number
  tabsClassName?: string
  contentClassName?: string
  tabWrapperComponent?: React.ReactNode
}

/**
 * The Tabs module takes a list of Tab Definitions, an active tab index N, and only renders the
 * N-th component in its children list. Component is uncontrolled to allow for Controller 
 * components to usee it higher in the hierarchy
 */
export function Tabs({
  tabDefinitions,
  tabsLayout = "full-width",
  activeIdx,
  tabsClassName,
  contentClassName,
  tabWrapperComponent,
  children
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.container)}>
      <nav className={cs(tabsClassName)}>
        {tabDefinitions.map((def, idx) => (
          <Tab 
            key={idx}
            active={idx === activeIdx}
            definition={def}
            layout={tabsLayout}
            wrapperComponent={tabWrapperComponent}
          />
        ))}
      </nav>
    </div>
  )
}