import style from "./AlgoliaSearch.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { useState, useEffect } from "react"
import { SearchInput } from "../Input/SearchInput"
import { SearchIndex } from "algoliasearch/lite"
import { useIsMounted } from "../../utils/hookts"
import { DocumentNode } from "graphql"
import { useLazyQuery } from "@apollo/client"
import { SearchTerm } from "../Utils/SearchTerm"


interface Props {
  searchIndex: SearchIndex,
  gqlMapQuery: DocumentNode,
  onResults: (results: any[]|null) => void,
  onLoading: (loading: boolean) => void
}

export function AlgoliaSearch({
  searchIndex,
  gqlMapQuery,
  onResults,
  onLoading,
}: Props) {
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const [search, setSearch] = useState<string>("")
  const [currentSearchString, setCurrentSearchString] = useState<string|null>(null)
  const [searchHits, setSearchHits] = useState<any>(null)
  const isMounted = useIsMounted()

  const triggerSearch = async () => {
    setSearchLoading(true)
    const results = await searchIndex.search(search, {
      hitsPerPage: 100
    })
    if (isMounted()) {
      setSearchHits(results)
    }
  }

  // query to get the results from a list of IDs
  const [getResults, { data: results, loading, error }] = useLazyQuery(gqlMapQuery, {
    fetchPolicy: "no-cache"
  })

  // @ts-ignore the query field to look at
  const queryField = gqlMapQuery.definitions[0].selectionSet.selections[0].name.value

  useEffect(() => {
    if (searchHits) {
      if (searchHits.nbHits === 0) {
        onResults([])
        setCurrentSearchString(search)
        setSearchLoading(false)
      }
      else {
        getResults({
          variables: {
            ids: searchHits.hits.map((hit: any) => parseInt(hit.objectID))
          }
        })
      }
    }
  }, [searchHits])

  useEffect(() => {
    setSearchLoading(false)
    setCurrentSearchString(search)
    onResults(results ? results[queryField] : null)
  }, [results])

  const clearResults = () => {
    setSearch("")
    setCurrentSearchString(null)
    onResults(null)
    setSearchLoading(false)
  }

  useEffect(() => {
    onLoading(searchLoading)
  }, [searchLoading])

  return (
    <div className={cs(layout['search-container'])}>
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="search by artist name, tags, title..."
        onSearch={triggerSearch}
        className={cs(layout['search-bar'])}
      />
      {currentSearchString && (
        <SearchTerm
          term={currentSearchString} 
          onClear={clearResults}
        />
      )}
    </div>
  )
}