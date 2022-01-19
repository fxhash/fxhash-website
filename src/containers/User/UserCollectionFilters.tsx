import style from "./UserCollectionFilters.module.scss"
import cs from "classnames"
import { FiltersGroup } from "../../components/Exploration/FiltersGroup"
import { InputText } from "../../components/Input/InputText"
import { useState } from "react"
import { InputRadioButtons, RadioOption } from "../../components/Input/InputRadioButtons"
import { Button } from "../../components/Button"
import { GenerativeTokenFilters } from "../../types/entities/GenerativeToken"


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

interface Props {
  filters: GenerativeTokenFilters
  setFilters: (filters: GenerativeTokenFilters) => void
}
export function UserCollectionFilters({
  filters,
  setFilters,
}: Props) {
  return (
    <>
      <FiltersGroup title="Mint progress">
        <InputRadioButtons
          value={filters.mintProgress_eq}
          onChange={(value) => setFilters({ ...filters, mintProgress_eq: value })}
          options={MintProgresOptions}
        />
      </FiltersGroup>

      <FiltersGroup title="Artist verified">
        <InputRadioButtons
          value={filters.authorVerified_eq}
          onChange={(value) => setFilters({ ...filters, authorVerified_eq: value })}
          options={ArtistVerificationOptions}
        />
      </FiltersGroup>
    </>
  )
}