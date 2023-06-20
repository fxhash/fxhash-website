import style from "./UserCollectionFilters.module.scss"
import cs from "classnames"
import { FiltersGroup } from "../../components/Exploration/FiltersGroup"
import { InputText } from "../../components/Input/InputText"
import { useEffect, useMemo, useState } from "react"
import {
  InputRadioButtons,
  RadioOption,
} from "../../components/Input/InputRadioButtons"
import { Button } from "../../components/Button"
import {
  GenerativeToken,
  GenerativeTokenFilters,
} from "../../types/entities/GenerativeToken"
import { useLazyQuery, useQuery } from "@apollo/client"
import { Qu_userObjktsSubResults } from "../../queries/user"
import { IUserCollectionFilters, User } from "../../types/entities/User"
import { UserBadge } from "../../components/User/UserBadge"
import {
  InputMultiList,
  MultiListItem,
} from "../../components/Input/InputMultiList"
import { ListItemGenerative } from "../../components/List/ListItemGenerative"

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

const ListingOptions: RadioOption[] = [
  {
    value: true,
    label: "Listed",
  },
  {
    value: false,
    label: "Not listed",
  },
  {
    value: undefined,
    label: "All",
  },
]

interface Props {
  user: User
  filters: IUserCollectionFilters
  setFilters: (filters: IUserCollectionFilters) => void
}
export function UserCollectionFilters({ user, filters, setFilters }: Props) {
  // we store the list of artists / collections in the state for better UX
  const [listArtists, setListArtists] = useState<MultiListItem[]>([])
  const [listGenerators, setListGenerators] = useState<MultiListItem[]>([])

  // we remove the issuer_in filter for the generative filters, same for authors
  const generativeFilters: IUserCollectionFilters = {
    ...filters,
    issuer_in: undefined,
  }
  const authorFilters: IUserCollectionFilters = {
    ...filters,
    author_in: undefined,
  }

  const { data, loading, fetchMore, refetch } = useQuery(
    Qu_userObjktsSubResults,
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        id: user.id,
        generativeFilters,
        authorFilters,
      },
      fetchPolicy: "no-cache",
    }
  )

  const artists: User[] | null = data?.user?.authorsFromObjktFilters || null
  const generativeTokens: GenerativeToken[] | null =
    data?.user?.generativeTokensFromObjktFilters || null

  // when the query isn't loading anymore, the lists gets updated
  useEffect(() => {
    const sortByString = (aStr?: string | null, bStr?: string | null) => {
      if (!aStr) return 1
      if (!bStr) return -1
      return aStr > bStr ? 1 : -1
    }

    if (!loading) {
      // build the list of artists
      let la: MultiListItem[] = []
      if (artists) {
        la = artists
          .map((artist) => ({
            value: artist.id,
            props: {
              artist,
            },
          }))
          .sort((aArtist, bArtist) =>
            sortByString(
              (aArtist.props.artist?.name || "").toLowerCase(),
              (bArtist.props.artist?.name || "").toLowerCase()
            )
          )
      }

      // build the list of generative tokens
      let lg: MultiListItem[] = []
      if (generativeTokens) {
        lg = generativeTokens
          .map((token) => ({
            value: token.id,
            props: {
              token,
            },
          }))
          .sort((aGentk, bGentk) =>
            sortByString(
              (aGentk.props.token?.name || "").toLowerCase(),
              (bGentk.props.token?.name || "").toLowerCase()
            )
          )
      }

      setListArtists(la)
      setListGenerators(lg)
    }
  }, [loading])

  const updateAuthorFilters = (selection: string[]) => {
    setFilters({
      ...filters,
      author_in: selection.length > 0 ? selection : undefined,
    })
  }

  const updateIssuerFilters = (selection: number[]) => {
    setFilters({
      ...filters,
      issuer_in: selection.length > 0 ? selection : undefined,
    })
  }

  return (
    <>
      <FiltersGroup title="Artist">
        <InputMultiList
          listItems={listArtists}
          selected={filters.author_in || []}
          onChangeSelected={updateAuthorFilters}
          className={cs(style.multi_list)}
        >
          {({ itemProps, selected }) => (
            <UserBadge user={itemProps.artist} size="small" hasLink={false} />
          )}
        </InputMultiList>
      </FiltersGroup>

      <FiltersGroup title="Generators">
        <InputMultiList
          listItems={listGenerators}
          selected={filters.issuer_in || []}
          onChangeSelected={updateIssuerFilters}
          className={cs(style.multi_list)}
        >
          {({ itemProps, selected }) => (
            <ListItemGenerative token={itemProps.token} />
          )}
        </InputMultiList>
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

      <FiltersGroup title="Artist verified">
        <InputRadioButtons
          value={filters.authorVerified_eq}
          onChange={(value) =>
            setFilters({ ...filters, authorVerified_eq: value })
          }
          options={ArtistVerificationOptions}
        />
      </FiltersGroup>

      <FiltersGroup title="Listing">
        <InputRadioButtons
          value={filters.activeListing_exist}
          onChange={(value) =>
            setFilters({ ...filters, activeListing_exist: value })
          }
          options={ListingOptions}
        />
      </FiltersGroup>
    </>
  )
}
