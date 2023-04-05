import { memo, useContext, useEffect } from "react"
import { IOptions, Select } from "components/Input/Select"
import { useQueryParam } from "hooks/useQueryParam"
import { useQueryParamSort } from "hooks/useQueryParamSort"
import style from "./OfferFilters.module.scss"
import { Slider } from "components/Input/Slider"
import { SettingsContext } from "context/Theme"

export type OfferSortOption =
  | "createdAt-desc"
  | "price-desc"
  | "price-asc"
  | "createdAt-asc"

const offersSortOptions: IOptions<OfferSortOption>[] = [
  {
    label: "recently created",
    value: "createdAt-desc",
  },
  {
    label: "price (high to low)",
    value: "price-desc",
  },
  {
    label: "price (low to high)",
    value: "price-asc",
  },
  {
    label: "oldest created",
    value: "createdAt-asc",
  },
]

type OfferFiltersSettingsKeys =
  | "marketplaceGenerativeOffers"
  | "userDashboardReceivedOffers"

export const useOfferFilters = (storageKey?: OfferFiltersSettingsKeys) => {
  const settings = useContext(SettingsContext)

  const { sortValue, sortVariable, sortOptions, setSortValue } =
    useQueryParamSort(offersSortOptions, {
      defaultSort: storageKey ? settings[storageKey].sort : "createdAt-desc",
    })

  const [floorThreshold, setFloorThreshold] = useQueryParam(
    "floor",
    storageKey ? settings[storageKey].floorThreshold : 50
  )

  return {
    floorThreshold,
    setFloorThreshold: (val: number) => {
      // update settings if we have a storage key
      if (storageKey)
        settings.update(storageKey, { floorThreshold: val, sort: sortValue })
      setFloorThreshold(val)
    },
    sortValue,
    sortVariable,
    sortOptions,
    setSortValue: (val: string) => {
      // update settings if we have a storage key
      if (storageKey) settings.update(storageKey, { floorThreshold, sort: val })
      setSortValue(val)
    },
  }
}

interface OfferFiltersProps {
  floorThreshold: number
  setFloorThreshold: (val: number) => void
  sortValue: string
  sortOptions: IOptions[]
  setSortValue: (val: string) => void
  showFloorThreshold?: boolean
}

const _OfferFilters = ({
  floorThreshold,
  setFloorThreshold,
  sortValue,
  sortOptions,
  setSortValue,
  showFloorThreshold = true,
}: OfferFiltersProps) => {
  return (
    <div className={style.offer_filters}>
      {showFloorThreshold && (
        <div className={style.floor_slider}>
          <div className={style.label}>
            <label>Floor threshold</label>
            <div>{floorThreshold}%</div>
          </div>
          <Slider
            min={0}
            max={100}
            step={10}
            value={floorThreshold}
            onChange={setFloorThreshold}
          />
        </div>
      )}

      <Select value={sortValue} options={sortOptions} onChange={setSortValue} />
    </div>
  )
}

export const OfferFilters = memo(_OfferFilters)
