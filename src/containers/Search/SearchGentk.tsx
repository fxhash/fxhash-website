import React, { memo } from "react"
import { ExploreGenerativeTokens } from "../ExploreGenerativeTokens"
import { TabSearchComponentProps } from "./PageSearch"

const _SearchGentk = ({ query, onChangeQuery }: TabSearchComponentProps) => {
  return (
    <ExploreGenerativeTokens
      initialSearchQuery={query}
      onChangeSearch={onChangeQuery}
    />
  )
}

export const SearchGentk = memo(_SearchGentk)
