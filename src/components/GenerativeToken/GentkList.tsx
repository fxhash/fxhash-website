import { useContext } from "react"
import { CardsContainer } from "components/Card/CardsContainer"
import { CardsLoading } from "components/Card/CardsLoading"
import { LargeGentkCard } from "components/Card/LargeGentkCard"
import { MasonryCardsContainer } from "components/Card/MasonryCardsContainer"
import { InfiniteScrollTrigger } from "components/Utils/InfiniteScrollTrigger"
import { SettingsContext } from "context/Theme"
import { Objkt } from "types/entities/Objkt"

interface GentkListProps {
  cardSize: number
  itemsPerPage: number
  loading: boolean
  tokens: Objkt[] | null
  onEndReached: () => void
  canTrigger: boolean
  emptyMessage?: string
  refCardsContainer: (node?: Element | null | undefined) => void
  sortVariable?: Record<string, string> | null
}

export const GentkList = ({
  tokens,
  loading,
  cardSize,
  canTrigger,
  itemsPerPage,
  refCardsContainer,
  sortVariable = null,
  emptyMessage = "No results",
  onEndReached,
}: GentkListProps) => {
  const { layoutMasonry } = useContext(SettingsContext)

  const CContainer = layoutMasonry ? MasonryCardsContainer : CardsContainer

  return (
    <>
      {!loading && tokens?.length === 0 && <span>{emptyMessage}</span>}

      <InfiniteScrollTrigger onTrigger={onEndReached} canTrigger={canTrigger}>
        <CContainer ref={refCardsContainer} cardSize={cardSize}>
          {tokens?.map((gentk) => (
            <LargeGentkCard
              key={gentk.id}
              objkt={gentk}
              showRarity={sortVariable?.rarity != null}
            />
          ))}
          {loading &&
            CardsLoading({
              number: itemsPerPage,
              type: "large",
            })}
        </CContainer>
      </InfiniteScrollTrigger>
    </>
  )
}
