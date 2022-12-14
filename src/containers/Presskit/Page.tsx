import Head from "next/head"
import React, {
  ElementType,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react"
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
import { ContentLogo } from "./ContentLogo"
import { ContentMedia } from "./ContentMedia"

export const pressKitTabs = ["fxhash", "brand", "logo", "media"] as const

export const pressKitTabLabel = {
  fxhash: "",
  brand: "brand",
  logo: "logo",
  media: "media",
}

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
  const [activeTab, setActiveTab] = useState(tab || "fxhash")
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
      setActiveTab(newTab)
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
  useEffect(() => {
    if (!router?.query?.slug?.[0]) return
    if (router.query.slug[0] !== activeTab)
      setActiveTab(router.query.slug[0] as PressKitTabKey)
  }, [router.query, activeTab, handleChangeTab])
  const Component = tabs[activeTab] ? tabs[activeTab].component : null
  const tabLabel = pressKitTabLabel[activeTab]
  return (
    <>
      <Head>
        <title>fxhash — press kit</title>
        <meta
          key="og:title"
          property="og:title"
          content={`fxhash — press kit ${tabLabel}`}
        />
        <meta
          key="description"
          name="description"
          content={`The press kit of fxhash - ${tabLabel}`}
        />
        <meta
          key="og:description"
          property="og:description"
          content={`The press kit of fxhash - ${tabLabel}`}
        />
        <meta key="og:type" property="og:type" content="website" />
        <meta
          key="og:image"
          property="og:image"
          content="https://www.fxhash.xyz/images/og/og1.jpg"
        />
      </Head>
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
            activeIdx={activeTab}
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
