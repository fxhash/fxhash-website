import style from "./CardsExplorer.module.scss"
import cs from "classnames"
import {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react"
import { SettingsContext } from "../../context/Theme"
import { useInView } from "react-intersection-observer"
import { useRouter } from "next/router"

const DEFAULT_SIZE = 270

/**
 * Component dedicated to holding the state of common explore pages (generative tokens, marketplace,
 * profile... etc)
 */

interface PropsChildren {
  filtersVisible: boolean
  setFiltersVisible: (visible: boolean) => void
  searchLoading: boolean
  setSearchLoading: (loading: boolean) => void
  refCardsContainer: (node?: Element | null | undefined) => void
  inViewCardsContainer: boolean
  isSearchMinimized: boolean
  setIsSearchMinimized: (state: boolean) => void
  cardSize: number
  setCardSize: (size: number | null) => void
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
  const settings = useContext(SettingsContext)
  const router = useRouter()

  const { ref: refCardsContainer, inView: inViewCardsContainer } = useInView({
    rootMargin: "-300px 0px -100px",
  })

  // is the filters panel visible ?
  const [filtersVisible, setFiltersVisible] = useState<boolean>(
    filtersVisibleDefault
  )
  // is the search loading ?
  const [searchLoading, setSearchLoading] = useState<boolean>(false)

  // get cardSize from scope or use default
  const cardSize = useMemo<number>(
    () =>
      !cardSizeScope || !settings.cardSize[cardSizeScope]
        ? DEFAULT_SIZE
        : settings.cardSize[cardSizeScope],
    [cardSizeScope, settings.cardSize]
  )

  const handleSetCardSize = (value) => {
    settings.update("cardSize", {
      ...settings.cardSize,
      [cardSizeScope]: value,
    })
  }

  // get the basePath from pathname
  const basePath = useMemo<string>(
    () => router.pathname.split("/")[1],
    [router.pathname]
  )
  const isActiveScope = basePath === cardSizeScope

  useEffect(() => {
    // cardSize scopes need to match the basePath to prevent race conditions
    // when updating cardSize for retained routes
    if (isActiveScope) {
      const root = document.documentElement
      root.style.setProperty("--cards-size", `${cardSize}px`)
      // Reset to default size when cleanup
      return () => {
        root.style.setProperty("--cards-size", `${DEFAULT_SIZE}px`)
      }
    }
  }, [cardSize, router.pathname])

  // is search minimized on mobile
  const [isSearchMinimized, setIsSearchMinimized] = useState<boolean>(true)

  return children({
    refCardsContainer,
    inViewCardsContainer,
    filtersVisible,
    setFiltersVisible,
    searchLoading,
    setSearchLoading,
    cardSize,
    setCardSize: handleSetCardSize,
    isSearchMinimized,
    setIsSearchMinimized,
  })
}
