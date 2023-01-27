import React, { memo } from "react"
import { GalleryUsers } from "../../components/Gallery/GalleryUsers"
import { TabSearchComponentProps } from "./PageSearch"

const _SearchUsers = ({ query, onChangeQuery }: TabSearchComponentProps) => {
  return (
    <GalleryUsers
      initialSearchQuery={query}
      initialSort={query ? "relevance-desc" : undefined}
      initialFilters={query ? { searchQuery_eq: query } : undefined}
      onChangeSearch={onChangeQuery}
    />
  )
}

export const SearchUsers = memo(_SearchUsers)
