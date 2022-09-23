// import style from "./TabsContainer.module.scss"
// import cs from "classnames"

import { FunctionComponent, useCallback, useState } from "react"
import { Props as TabsProps, Tabs } from "./Tabs"

interface PropsChildren {
  tabIndex: number
}

interface TabContainerProps extends Omit<TabsProps, "activeIdx"> {
  initialIdx?: number
  children: FunctionComponent<PropsChildren>
}
/**
 * The TabsContainer Component wraps the tabs and uses the render props pattern to
 * pass down the active tab to the children component
 */
export function TabsContainer({
  initialIdx,
  checkIsTabActive,
  onClickTab,
  tabsLayout,
  tabDefinitions,
  tabsClassName,
  contentClassName,
  tabWrapperComponent,
  children,
}: TabContainerProps) {
  const [index, setIndex] = useState<number>(initialIdx || 0)

  const handleClickTab = useCallback(
    (newIdx, newDef) => {
      setIndex(newIdx)
      onClickTab?.(newIdx, newDef)
    },
    [onClickTab]
  )
  return (
    <>
      <Tabs
        activeIdx={index}
        checkIsTabActive={checkIsTabActive}
        onClickTab={handleClickTab}
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
