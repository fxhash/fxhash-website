import React, { ElementType, memo, useCallback, useState } from "react"
import {
  checkIsTabKeyActive,
  TabDefinition,
  Tabs,
} from "../../components/Layout/Tabs"
import { useRouter } from "next/router"
import { SearchSummary } from "./SearchSummary"
import { SearchUsers } from "./SearchUsers"
import { SearchGentk } from "./SearchGentk"
import { SearchArticles } from "./SearchArticles"
import { SearchMarketplace } from "./SearchMarketplace"
import Head from "next/head"
import { Spacing } from "../../components/Layout/Spacing"

export const searchTabs = [
  "summary",
  "users",
  "projects",
  "articles",
  "marketplace",
] as const
export type SearchTabKey = typeof searchTabs[number]

export interface TabSearchComponentProps {
  query?: string
  onChangeQuery: (value: string) => void
  onChangeTab: (newTab: SearchTabKey) => void
}
interface SearchTabData {
  component: ElementType<TabSearchComponentProps>
}
const tabs: Record<SearchTabKey, SearchTabData> = {
  summary: {
    component: SearchSummary,
  },
  users: {
    component: SearchUsers,
  },
  projects: {
    component: SearchGentk,
  },
  articles: {
    component: SearchArticles,
  },
  marketplace: {
    component: SearchMarketplace,
  },
}
const tabsDefinitions: TabDefinition[] = Object.entries(tabs).map(
  ([key, value]) => ({
    key,
    name: key,
  })
)

interface PageSearchProps {
  tab?: SearchTabKey
  query?: string
}
const _PageSearch = ({ query: queryUrl, tab }: PageSearchProps) => {
  const router = useRouter()
  const [query, setQuery] = useState(queryUrl)
  const [activeIdx, setActiveIdx] = useState(tab || "summary")
  const handleReplaceUrl = useCallback(
    (queryString, sectionKey) => {
      const section = sectionKey === "summary" ? "" : sectionKey
      router.push(
        `/search/${section}${
          queryString ? `?query=${encodeURIComponent(queryString)}` : ""
        }`,
        "",
        {
          shallow: true,
        }
      )
    },
    [router]
  )
  const handleChangeTab = useCallback(
    (newTab) => {
      setActiveIdx(newTab)
      handleReplaceUrl(query, newTab)
    },
    [handleReplaceUrl, query]
  )
  const handleClickTab = useCallback(
    (newIdx, newDef) => {
      handleChangeTab(newDef.key)
    },
    [handleChangeTab]
  )
  const handleChangeQuery = useCallback(
    (newQuery) => {
      setQuery(newQuery)
      handleReplaceUrl(newQuery, activeIdx)
    },
    [activeIdx, handleReplaceUrl]
  )

  const Component = tabs[activeIdx] ? tabs[activeIdx].component : null
  const title = `fxhash — search${query ? ` "${query}"` : ""}`
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta key="og:title" property="og:title" content={title} />
        <meta
          key="description"
          name="description"
          content="Search fxhash by users, gentk, articles and marketplace listings"
        />
        <meta
          key="og:description"
          property="og:description"
          content="Search fxhash by users, gentk, articles and marketplace listings"
        />
        <meta key="og:type" property="og:type" content="website" />
        <meta
          key="og:image"
          property="og:image"
          content="https://www.fxhash.xyz/images/og/og1.jpg"
        />
      </Head>
      <Spacing size="3x-large"/>
      <Tabs
        onClickTab={handleClickTab}
        checkIsTabActive={checkIsTabKeyActive}
        tabDefinitions={tabsDefinitions}
        activeIdx={activeIdx}
      />
      {Component ? (
        <Component
          query={query}
          onChangeQuery={handleChangeQuery}
          onChangeTab={handleChangeTab}
        />
      ) : (
        <div>Search section not found</div>
      )}
      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

export const PageSearch = memo(_PageSearch)
