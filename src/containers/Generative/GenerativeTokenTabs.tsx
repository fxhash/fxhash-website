import React, { memo, useMemo } from "react"
import { TabDefinition } from "../../components/Layout/Tabs"
import style from "../../styles/GenerativeTokenDetails.module.scss"
import { GenerativeIterations } from "./Iterations/GenerativeIterations"
import cs from "classnames"
import layout from "../../styles/Layout.module.scss"
import { Spacing } from "../../components/Layout/Spacing"
import { GenerativeActions } from "./Actions"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { TabsContainer } from "../../components/Layout/TabsContainer"
import { GenerativeMintTickets } from "./GenerativeMintTickets"

const defaultTabs: TabDefinition[] = [
  {
    key: "iterations",
    name: "iterations",
  },
  {
    key: "activity",
    name: "activity",
  },
]
interface GenerativeTokenTabsProps {
  token: GenerativeToken
}

const _GenerativeTokenTabs = ({ token }: GenerativeTokenTabsProps) => {
  const tabs = useMemo(() => {
    const dynamicTabs = [...defaultTabs]
    if (token.mintTicketSettings) {
      dynamicTabs.push({
        key: "mint-tickets",
        name: "mint tickets",
      })
    }
    return dynamicTabs
  }, [token.mintTicketSettings])
  return (
    <TabsContainer
      className={style.tabs}
      tabDefinitions={tabs}
      tabsLayout="fixed-size"
      initialIdx={0}
    >
      {({ tabKey }) => (
        <>
          {tabKey === "iterations" && <GenerativeIterations token={token} />}
          {tabKey === "activity" && (
            <main className={cs(layout["padding-big"])}>
              <Spacing size="x-large" />
              <GenerativeActions token={token} className={style.activity} />
            </main>
          )}
          {tabKey === "mint-tickets" && (
            <main className={cs(layout["padding-big"])}>
              <Spacing size="x-large" />
              <GenerativeMintTickets token={token} />
            </main>
          )}
        </>
      )}
    </TabsContainer>
  )
}

export const GenerativeTokenTabs = memo(_GenerativeTokenTabs)
