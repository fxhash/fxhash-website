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
import useIsMobile from "../../hooks/useIsMobile"

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
  setCardSize: (size: number) => void
}

interface Props {
  cardSizeScope?: string
  children: FunctionComponent<PropsChildren>
}

export function CardsExplorer({ cardSizeScope, children }: Props) {
  const settings = useContext(SettingsContext)
  const router = useRouter()
  const isMobile = useIsMobile()

  const { ref: refCardsContainer, inView: inViewCardsContainer } = useInView({
    rootMargin: "-300px 0px -100px",
  })

  // is the filters panel visible ?
  const [filtersVisible, setFiltersVisible] = useState<boolean>(false)
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

  const handleSetCardSize = (value: number) => {
    settings.update("cardSize", {
      ...settings.cardSize,
      [cardSizeScope!]: value,
    })
  }

  useEffect(() => {
    // cardSize scopes need to match the basePath to prevent race conditions
    // when updating cardSize for retained routes
    const root = document.documentElement
    root.style.setProperty("--cards-size", `${cardSize}px`)
    // Reset to default size when cleanup
    return () => {
      root.style.setProperty("--cards-size", `${DEFAULT_SIZE}px`)
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
