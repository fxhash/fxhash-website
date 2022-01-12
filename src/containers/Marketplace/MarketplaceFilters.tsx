import style from "./MarketplaceFilters.module.scss"
import cs from "classnames"
import { FiltersGroup } from "../../components/Exploration/FiltersGroup"
import { InputText } from "../../components/Input/InputText"
import { useState } from "react"
import { InputRadioButtons, RadioOption } from "../../components/Input/InputRadioButtons"
import { Button } from "../../components/Button"
import { OfferFilters } from "../../types/entities/Offer"


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
  filters: OfferFilters
  setFilters: (filters: OfferFilters) => void
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

  return (
    <>
      <FiltersGroup title="Price">
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
            size="small"
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