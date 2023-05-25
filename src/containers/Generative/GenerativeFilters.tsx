import style from "./GenerativeFilters.module.scss"
import cs from "classnames"
import { FiltersGroup } from "../../components/Exploration/FiltersGroup"
import { InputText } from "../../components/Input/InputText"
import { useMemo, useState } from "react"
import {
  InputRadioButtons,
  RadioOption,
} from "../../components/Input/InputRadioButtons"
import { Button } from "../../components/Button"
import { GenerativeTokenFilters } from "../../types/entities/GenerativeToken"
import { InputMultiList } from "components/Input/InputMultiList"
import { InputRadioMultiButtons } from "components/Input/InputRadioMultiButtons"

const MintProgresOptions: RadioOption[] = [
  {
    value: "COMPLETED",
    label: "Completed",
  },
  {
    value: "ONGOING",
    label: "On going",
  },
  {
    value: "ALMOST",
    label: "Almost done",
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

interface IBooleanFilterDef {
  label: string
  value: keyof GenerativeTokenFilters
}

const booleanFiltersDef: IBooleanFilterDef[] = [
  {
    label: "fx(params)",
    value: "fxparams_eq",
  },
  {
    label: "redeemable",
    value: "redeemable_eq",
  },
]

interface Props {
  filters: GenerativeTokenFilters
  setFilters: (filters: GenerativeTokenFilters) => void
}
export function GenerativeFilters({ filters, setFilters }: Props) {
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")

  const updatePriceFilters = (evt: any) => {
    evt.preventDefault()
    const minp = minPrice
      ? Math.floor(parseFloat(minPrice) * 1000000)
      : undefined
    const maxp = maxPrice
      ? Math.floor(parseFloat(maxPrice) * 1000000)
      : undefined
    setFilters({
      ...filters,
      price_gte: minp,
      price_lte: maxp,
    })
  }

  const [minTokenSupply, setMinTokenSupply] = useState<string>("")
  const [maxTokenSupply, setMaxTokenSupply] = useState<string>("")

  const updateSupplyFilters = (evt: any) => {
    evt.preventDefault()
    const min = minTokenSupply ? parseInt(minTokenSupply) : undefined
    const max = maxTokenSupply ? parseFloat(maxTokenSupply) : undefined
    setFilters({
      ...filters,
      supply_gte: min,
      supply_lte: max,
    })
  }

  // derive booleanFilters (list of strings, each string is property filter)
  const booleanFilters = useMemo(() => {
    const out: string[] = []
    for (const bf of booleanFiltersDef) {
      if (filters[bf.value] === true) {
        out.push(bf.value)
      }
    }
    return out
  }, [filters])

  const updateBooleanFilters = (enabledFilters: string[]) => {
    const out: GenerativeTokenFilters = {
      ...filters,
    }
    for (const bf of booleanFiltersDef) {
      ;(out[bf.value] as any) = enabledFilters.includes(bf.value)
        ? true
        : undefined
    }
    setFilters(out)
  }

  return (
    <>
      <FiltersGroup title="Price (tez)">
        <form onSubmit={updatePriceFilters}>
          <div className={cs(style.price_range)}>
            <InputText
              value={minPrice}
              onChange={(evt) => setMinPrice(evt.target.value)}
              placeholder="Min"
            />
            <span>to</span>
            <InputText
              value={maxPrice}
              onChange={(evt) => setMaxPrice(evt.target.value)}
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
          value={filters.mintProgress_eq}
          onChange={(value) =>
            setFilters({ ...filters, mintProgress_eq: value })
          }
          options={MintProgresOptions}
        />
      </FiltersGroup>

      <FiltersGroup title="Number of editions">
        <form onSubmit={updateSupplyFilters}>
          <div className={cs(style.price_range)}>
            <InputText
              value={minTokenSupply}
              onChange={(evt) => setMinTokenSupply(evt.target.value)}
              placeholder="Min"
            />
            <span>to</span>
            <InputText
              value={maxTokenSupply}
              onChange={(evt) => setMaxTokenSupply(evt.target.value)}
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
          onChange={(value) =>
            setFilters({ ...filters, authorVerified_eq: value })
          }
          options={ArtistVerificationOptions}
        />
      </FiltersGroup>

      <FiltersGroup title="More...">
        <InputRadioMultiButtons
          options={booleanFiltersDef}
          value={booleanFilters}
          onChange={updateBooleanFilters}
        />
      </FiltersGroup>
    </>
  )
}
