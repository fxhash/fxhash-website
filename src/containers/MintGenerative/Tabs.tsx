import { useEffect, useState, useMemo } from "react"
import { useLocation, useRouteMatch } from "react-router"
import { Spacing } from "../../components/Layout/Spacing"
import { Tabs } from "../../components/Layout/Tabs"
import { Step } from "../../types/Steps"
import { TabDefinition } from "../../components/Layout/Tabs"
import style from "./Tabs.module.scss"
import cs from "classnames"


interface Props {
  steps: Step[]
}

const TABS = [ 
  {
    name: "1. Upload to IPFS",
  },
  {
    name: "2. Check files",
  },
  {
    name: "3. Configure capture",
  },
  {
    name: "4. Verifications",
  },
  {
    name: "5. Mint",
  }
]

export function MintGenerativeTabs({ steps }: Props) {
  const location = useLocation()

  const [paths, tabs] = useMemo<[string[], TabDefinition[]]>(() => {
    const filter = steps.filter(step => !step.hideTabs)
    return [
      filter.map(step => step.path),
      filter.map(step => ({ name: step.title! }))
    ]
  }, [steps])

  const tabIndex = useMemo<number>(() => {
    return paths.indexOf(location.pathname)
  }, [location, paths])
  
  return tabIndex >= 0 
  ?(
    <>
      <Tabs
        tabDefinitions={tabs}
        activeIdx={tabIndex}
        tabsLayout="full-width"
        tabsClassName={cs(style.tab)}
      />
      <Spacing size="2x-large"/>
    </>
  ):(null)
}