import style from "./MarketplaceFilters.module.scss"
import cs from "classnames"
import { FiltersGroup } from "../../components/Exploration/FiltersGroup"
import { InputText } from "../../components/Input/InputText"
import { useState } from "react"
import { InputRadioButtons, RadioOption } from "../../components/Input/InputRadioButtons"
import { Button } from "../../components/Button"
import { ListingFilters } from "../../types/entities/Listing"


const MintProgresOptions: RadioOption[] = [
  {
    value: true,
    label: "Completed",
  },
  {
    value: false,
    label: "On going",
  },
  {
    value: undefined,
    label: "All",
  },
]

const ArtistVerificationOptions: RadioOption[] = [
  {
    value: true,
    label: "Verified",
  },
  {
    value: false,
    label: "Un-verified",
  },
  {
    value: undefined,
    label: "All",
  },
]

interface Props {
  filters: ListingFilters
  setFilters: (filters: ListingFilters) => void
}
export function MarketplaceFilters({
  filters,
  setFilters,
}: Props) {
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")

  const updatePriceFilters = (evt: any) => {
    evt.preventDefault()
    const minp = minPrice ? ""+(parseFloat(minPrice) * 1000000) : undefined
    const maxp = maxPrice ? ""+(parseFloat(maxPrice) * 1000000) : undefined
    setFilters({
      ...filters,
      price_gte: minp,
      price_lte: maxp,
    })
  }

  const [minTokenSupply, setMinTokenSupply] = useState<string>("")
  const [maxTokenSupply, setMaxTokenSupply] = useState<string>("")

  const updateTokenSupplyFilters = (evt: any) => {
    evt.preventDefault()
    const min = minTokenSupply ? parseInt(minTokenSupply) : undefined
    const max = maxTokenSupply ? parseFloat(maxTokenSupply) : undefined
    setFilters({
      ...filters,
      tokenSupply_gte: min,
      tokenSupply_lte: max,
    })
  }

  return (
    <>
      <FiltersGroup title="Price (tez)">
        <form onSubmit={updatePriceFilters}>
          <div className={cs(style.price_range)}>
            <InputText
              value={minPrice}
              onChange={evt => setMinPrice(evt.target.value)}
              placeholder="Min"
            />
            <span>to</span>
            <InputText
              value={maxPrice}
              onChange={evt => setMaxPrice(evt.target.value)}
              placeholder="Max"
            />
          </div>
          <Button
            type="submit"
            color="black"
            size="very-small"
            className={cs(style.apply_btn)}
          >
            apply
          </Button>
        </form>
      </FiltersGroup>

      <FiltersGroup title="Mint progress">
        <InputRadioButtons
          value={filters.fullyMinted_eq}
          onChange={(value) => setFilters({ ...filters, fullyMinted_eq: value })}
          options={MintProgresOptions}
        />
      </FiltersGroup>

      <FiltersGroup title="Number of editions">
        <form onSubmit={updateTokenSupplyFilters}>
          <div className={cs(style.price_range)}>
            <InputText
              value={minTokenSupply}
              onChange={evt => setMinTokenSupply(evt.target.value)}
              placeholder="Min"
            />
            <span>to</span>
            <InputText
              value={maxTokenSupply}
              onChange={evt => setMaxTokenSupply(evt.target.value)}
              placeholder="Max"
            />
          </div>
          <Button
            type="submit"
            color="black"
            size="very-small"
            className={cs(style.apply_btn)}
          >
            apply
          </Button>
        </form>
      </FiltersGroup>

      <FiltersGroup title="Artist">
        <InputRadioButtons
          value={filters.authorVerified_eq}
          onChange={(value) => setFilters({ ...filters, authorVerified_eq: value })}
          options={ArtistVerificationOptions}
        />
      </FiltersGroup>
    </>
  )
}