import style from "./CardsExplorer.module.scss"
import cs from "classnames"
import { FunctionComponent, useState, useEffect, useContext, useMemo } from "react"
import { SettingsContext } from '../../context/Theme';
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
  cardSizeScope?: string
  children: FunctionComponent<PropsChildren>
}
export function CardsExplorer({
  filtersVisibleDefault = false,
  cardSizeScope,
  children,
}: Props) {

  const settings = useContext(SettingsContext);
  // is the filters panel visible ?
  const [filtersVisible, setFiltersVisible] = useState<boolean>(filtersVisibleDefault)
  // is the search loading ?
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  // get cardSize from scope or use default
  const cardSize = useMemo<number>(
    () => !cardSizeScope ? 270 : settings.cardSize,
    [settings.cardSize, cardSizeScope]
  )
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--cards-size", `${cardSize}px`)
  }, [cardSize])

  return children({
    filtersVisible,
    setFiltersVisible,
    searchLoading,
    setSearchLoading,
    cardSize,
    setCardSize: (value) => settings.update('cardSize', value),
  })
}
