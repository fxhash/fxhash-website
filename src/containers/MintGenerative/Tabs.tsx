import { useMemo } from "react"
import { useLocation } from "react-router"
import { Spacing } from "../../components/Layout/Spacing"
import { Tabs } from "../../components/Layout/Tabs"
import { Step } from "../../types/Steps"
import { TabDefinition } from "../../components/Layout/Tabs"
import style from "./Tabs.module.scss"
import cs from "classnames"

interface Props {
  steps: Step[]
}

export function MintGenerativeTabs({ steps }: Props) {
  const location = useLocation()

  const [paths, tabs] = useMemo<[string[], TabDefinition[]]>(() => {
    const filter = steps.filter((step) => !step.hideTabs)
    return [
      filter.map((step) => step.path),
      filter.map((step, idx) => ({
        name: step.title!,
        props: {
          idx: idx,
        },
      })),
    ]
  }, [steps])

  const tabIndex = useMemo<number>(() => {
    return paths.indexOf(location.pathname)
  }, [location, paths])

  return tabIndex >= 0 ? (
    <>
      <Spacing size="none" sm="x-small" />
      <Tabs
        tabDefinitions={tabs}
        activeIdx={tabIndex}
        tabsLayout="full-width"
        tabsClassName={cs(style.tab)}
        tabWrapperComponent={(props: any) => (
          <div
            {...props}
            style={{
              flexGrow: tabIndex === props.idx ? 2.5 : 1,
            }}
          >
            <span>{props.idx + 1}</span>
            {tabIndex === props.idx && <span>. {props.children}</span>}
          </div>
        )}
      />
      <Spacing size="2x-large" sm="x-large" />
    </>
  ) : null
}
