import React, { memo } from "react"
import { TabSearchComponentProps } from "./PageSearch"
import { ExploreArticles } from "../Explore/ExploreArticles"

const _SearchArticles = ({ query, onChangeQuery }: TabSearchComponentProps) => {
  return (
    <ExploreArticles
      initialSearchQuery={query}
      onChangeSearch={onChangeQuery}
    />
  )
}

export const SearchArticles = memo(_SearchArticles)
