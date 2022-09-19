// import style from "./TabsContainer.module.scss"
// import cs from "classnames"

import { FunctionComponent, PropsWithChildren, useState } from "react"
import { Props as TabsProps, Tabs } from "./Tabs"

interface PropsChildren {
  tabIndex: number
}

interface Props extends Omit<TabsProps, "activeIdx"> {
  children: FunctionComponent<PropsChildren>
}
/**
 * The TabsContainer Component wraps the tabs and uses the render props pattern to
 * pass down the active tab to the children component
 */
export function TabsContainer({
  tabsLayout,
  tabDefinitions,
  tabsClassName,
  contentClassName,
  tabWrapperComponent,
  children,
}: Props) {
  const [index, setIndex] = useState<number>(0)

  return (
    <>
      <Tabs
        activeIdx={index}
        onClickTab={setIndex}
        tabDefinitions={tabDefinitions}
        tabsLayout={tabsLayout}
        tabsClassName={tabsClassName}
        contentClassName={contentClassName}
        tabWrapperComponent={tabWrapperComponent}
      />

      {children({
        tabIndex: index,
      })}
    </>
  )
}
