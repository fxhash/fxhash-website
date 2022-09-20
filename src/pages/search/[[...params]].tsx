import React from "react"
import {
  PageSearch,
  SearchTabKey,
  searchTabs,
} from "../../containers/Search/PageSearch"
import { GetServerSideProps } from "next"

interface SearchProps {
  tab: SearchTabKey
  query?: string
}

export default function Search({ tab, query }: SearchProps) {
  return <PageSearch initialTab={tab} query={query} />
}

export const getServerSideProps: GetServerSideProps<SearchProps> = async ({
  query: { query, params },
}) => {
  const queryString = query ? query.toString() : ""
  if (!params || params.length === 0) {
    return {
      props: {
        query: queryString && queryString.toString(),
        tab: "summary",
      },
    }
  }
  const tab = params[0] as SearchTabKey
  if (
    params.length === 1 &&
    searchTabs.indexOf(tab) > -1 &&
    tab !== "summary"
  ) {
    return {
      props: {
        query: queryString,
        tab,
      },
    }
  }
  return {
    notFound: true,
  }
}
