import style from "./CardsExplorer.module.scss"
import cs from "classnames"
import { FunctionComponent, useState } from "react"


/**
 * Component dedicated to holding the state of common explore pages (generative tokens, marketplace,
 * profile... etc)
 */

interface PropsChildren {
  filtersVisible: boolean
  setFiltersVisible: (visible: boolean) => void
  searchLoading: boolean
  setSearchLoading: (loading: boolean) => void
}

interface Props {
  filtersVisibleDefault?: boolean
  children: FunctionComponent<PropsChildren>
}
export function CardsExplorer({
  filtersVisibleDefault = false,
  children,
}: Props) {
  // is the filters panel visible ?
  const [filtersVisible, setFiltersVisible] = useState<boolean>(filtersVisibleDefault)
  // is the search loading ?
  const [searchLoading, setSearchLoading] = useState<boolean>(false)

  return children({
    filtersVisible,
    setFiltersVisible,
    searchLoading,
    setSearchLoading
  })
}