import style from "./AlgoliaSearch.module.scss"
import styleSearch from "./Search.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { useState, useEffect } from "react"
import { SearchInput } from "../Input/SearchInput"
import { SearchIndex } from "algoliasearch/lite"
import { useIsMounted } from "../../utils/hookts"
import { DocumentNode } from "graphql"
import { useLazyQuery } from "@apollo/client"
import { SearchTerm } from "../Utils/SearchTerm"
import { PropsWithChildren } from "react-router/node_modules/@types/react"
import { SearchHeader } from "./SearchHeader"


interface Props {
  searchIndex: SearchIndex,
  gqlMapQuery: DocumentNode,
  onResults: (results: any[]|null) => void,
  onLoading: (loading: boolean) => void,
  variables?: Record<string, any>
  nbHits?: number
}

const defaultVariables = {}

export function AlgoliaSearch({
  searchIndex,
  gqlMapQuery,
  onResults,
  onLoading,
  variables = defaultVariables,
  nbHits = 100,
  children,
}: PropsWithChildren<Props>) {
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const [search, setSearch] = useState<string>("")
  const [currentSearchString, setCurrentSearchString] = useState<string|null>(null)
  const [searchHits, setSearchHits] = useState<any>(null)
  const isMounted = useIsMounted()
  
  // query to get the results from a list of IDs
  const [getResults, { data: results, loading, error }] = useLazyQuery(gqlMapQuery, {
    fetchPolicy: "no-cache"
  })

  const triggerSearch = async () => {
    setSearchLoading(true)
    const results = await searchIndex.search(search, {
      hitsPerPage: nbHits
    })
    if (isMounted()) {
      setSearchHits(results)
    }
  }
  
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
            ids: searchHits.hits.map((hit: any) => parseInt(hit.objectID)),
            ...variables
          }
        })
      }
    }
  }, [searchHits, variables])

  useEffect(() => {
    setSearchLoading(false)
    setCurrentSearchString(search)
    if (!loading) {
      onResults(results ? results[queryField] : null)
    }
  }, [results])

  const clearResults = () => {
    setSearch("")
    setCurrentSearchString(null)
    onResults(null)
    setSearchLoading(false)
    setSearchHits(null)
  }

  useEffect(() => {
    onLoading(searchLoading)
  }, [searchLoading])

  return (
    <>
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="search by artist name, tags, title..."
        onSearch={triggerSearch}
        className={cs(styleSearch.search_bar)}
      />
      {currentSearchString && (
        <SearchTerm
          term={currentSearchString} 
          onClear={clearResults}
        />
      )}
    </>
  )
}