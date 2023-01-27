import React, { memo } from "react"
import { GalleryMarketplace } from "../../components/Gallery/GalleryMarketplace"
import { TabSearchComponentProps } from "./PageSearch"

const _SearchMarketplace = ({
  query,
  onChangeQuery,
}: TabSearchComponentProps) => {
  return (
    <GalleryMarketplace
      initialSearchQuery={query}
      initialSort={query ? "relevance-desc" : undefined}
      initialFilters={query ? { searchQuery_eq: query } : undefined}
      onChangeSearch={onChangeQuery}
    />
  )
}

export const SearchMarketplace = memo(_SearchMarketplace)
