import style from "./CardsExplorer.module.scss"
import cs from "classnames"
import { FunctionComponent, useState } from "react"
import { useInView } from "react-intersection-observer";


/**
 * Component dedicated to holding the state of common explore pages (generative tokens, marketplace,
 * profile... etc)
 */

interface PropsChildren {
  filtersVisible: boolean
  setFiltersVisible: (visible: boolean) => void
  searchLoading: boolean
  setSearchLoading: (loading: boolean) => void,
  refCardsContainer: (node?: (Element | null | undefined)) => void,
  inViewCardsContainer: boolean,
}

interface Props {
  filtersVisibleDefault?: boolean
  children: FunctionComponent<PropsChildren>
}
export function CardsExplorer({
  filtersVisibleDefault = false,
  children,
}: Props) {
  const { ref: refCardsContainer, inView: inViewCardsContainer } = useInView({
    rootMargin: '-300px 0px -100px'
  });

  // is the filters panel visible ?
  const [filtersVisible, setFiltersVisible] = useState<boolean>(filtersVisibleDefault)
  // is the search loading ?
  const [searchLoading, setSearchLoading] = useState<boolean>(false)

  return children({
    refCardsContainer,
    inViewCardsContainer,
    filtersVisible,
    setFiltersVisible,
    searchLoading,
    setSearchLoading
  })
}
