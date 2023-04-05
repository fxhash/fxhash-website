import { memo } from "react"
import { IOptions, Select } from "components/Input/Select"
import { useQueryParam } from "hooks/useQueryParam"
import { useQueryParamSort } from "hooks/useQueryParamSort"
import style from "./OfferFilters.module.scss"
import { Slider } from "components/Input/Slider"

const offersSortOptions: IOptions[] = [
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

export const useOfferFilters = (defaultSort?: string) => {
  const { sortValue, sortVariable, sortOptions, setSortValue } =
    useQueryParamSort(offersSortOptions, {
      defaultSort,
    })

  const [floorThreshold, setFloorThreshold] = useQueryParam("floor", 50)

  return {
    floorThreshold,
    setFloorThreshold,
    sortValue,
    sortVariable,
    sortOptions,
    setSortValue,
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
