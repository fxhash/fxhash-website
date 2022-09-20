import React, {
  ElementType,
  memo,
  NamedExoticComponent,
  ReactElement,
  ReactNode,
  useCallback,
  useState,
} from "react"
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

export const searchTabs = [
  "summary",
  "users",
  "gentk",
  "articles",
  "marketplace",
] as const
export type SearchTabKey = typeof searchTabs[number]

export interface TabSearchComponentProps {
  query?: string
  onChangeQuery: (value: string) => void
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
  gentk: {
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
  initialTab?: SearchTabKey
  query?: string
}
const _PageSearch = ({ query: initialQuery, initialTab }: PageSearchProps) => {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [activeIdx, setActiveIdx] = useState(initialTab || "summary")
  const handleReplaceUrl = useCallback(
    (queryString, sectionKey) => {
      const section = sectionKey === "summary" ? "" : sectionKey
      router.replace(
        `/search/${section}${
          queryString ? `?query=${encodeURIComponent(queryString)}` : ""
        }`
      )
    },
    [router]
  )
  const handleClickTab = useCallback(
    (newIdx, newDef) => {
      setActiveIdx(newDef.key)
      handleReplaceUrl(query, newDef.key)
    },
    [handleReplaceUrl, query]
  )
  const handleChangeQuery = useCallback(
    (newQuery) => {
      setQuery(newQuery)
      handleReplaceUrl(newQuery, activeIdx)
    },
    [activeIdx, handleReplaceUrl]
  )

  const Component = tabs[activeIdx] ? tabs[activeIdx].component : null
  return (
    <>
      <Tabs
        onClickTab={handleClickTab}
        checkIsTabActive={checkIsTabKeyActive}
        tabDefinitions={tabsDefinitions}
        activeIdx={activeIdx}
      />
      {Component ? (
        <Component query={query} onChangeQuery={handleChangeQuery} />
      ) : (
        <div>Search section not found</div>
      )}
    </>
  )
}

export const PageSearch = memo(_PageSearch)
