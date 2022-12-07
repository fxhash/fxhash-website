import React, { ElementType, memo, useCallback, useState } from "react"
import cs from "classnames"
import {
  checkIsTabKeyActive,
  TabDefinition,
  Tabs,
} from "../../components/Layout/Tabs"
import { useRouter } from "next/router"
import layout from "../../styles/Layout.module.scss"
import { SectionHeader } from "../../components/Layout/SectionHeader"
import { TitleHyphen } from "../../components/Layout/TitleHyphen"
import { Spacing } from "../../components/Layout/Spacing"
import { ContentFxHash } from "./ContentFxHash"
import { ContentBrand } from "./ContentBrand"
import {ContentLogo} from "./ContentLogo"
import {ContentMedia} from "./ContentMedia"

export const pressKitTabs = ["fxhash", "brand", "logo", "media"] as const

export type PressKitTabKey = typeof pressKitTabs[number]

export interface TabPressKitComponentProps {}
interface PressKitTabData {
  component: ElementType<TabPressKitComponentProps>
}
const tabs: Record<PressKitTabKey, PressKitTabData> = {
  fxhash: {
    component: ContentFxHash,
  },
  brand: {
    component: ContentBrand,
  },
  logo: {
    component: ContentLogo,
  },
  media: {
    component: ContentMedia,
  },
}
const tabsDefinitions: TabDefinition[] = Object.entries(tabs).map(
  ([key, value]) => ({
    key,
    name: key,
  })
)
interface PagePressKitProps {
  tab?: PressKitTabKey
}
const PressKitPage = ({ tab }: PagePressKitProps) => {
  const router = useRouter()
  const [activeIdx, setActiveIdx] = useState(tab || "fxhash")
  const handleReplaceUrl = useCallback(
    (sectionKey) => {
      const section = sectionKey === "fxhash" ? "" : sectionKey
      router.push(`/press-kit/${section}`, "", {
        shallow: true,
      })
    },
    [router]
  )
  const handleChangeTab = useCallback(
    (newTab) => {
      setActiveIdx(newTab)
      handleReplaceUrl(newTab)
    },
    [handleReplaceUrl]
  )
  const handleClickTab = useCallback(
    (newIdx, newDef) => {
      handleChangeTab(newDef.key)
    },
    [handleChangeTab]
  )
  const Component = tabs[activeIdx] ? tabs[activeIdx].component : null
  return (
    <>
      <Spacing size="large" sm="x-large" />

      <section>
        <SectionHeader>
          <TitleHyphen>press kit</TitleHyphen>
        </SectionHeader>

        <Spacing size="3x-large" sm="regular" />

        <main className={cs(layout["padding-big"])}>
          <p>Thanks for your interest in fxhash!</p>
          <Spacing size="3x-large" sm="x-large" />

          <Tabs
            tabsLayout="fixed-size-narrow"
            onClickTab={handleClickTab}
            checkIsTabActive={checkIsTabKeyActive}
            tabDefinitions={tabsDefinitions}
            activeIdx={activeIdx}
          />
          <Spacing size="large" sm="x-large" />
          {Component && <Component />}
          <Spacing size="6x-large" sm="x-large" />
          <Spacing size="6x-large" sm="x-large" />
          <Spacing size="6x-large" sm="x-large" />
        </main>
      </section>
    </>
  )
}

export default PressKitPage
