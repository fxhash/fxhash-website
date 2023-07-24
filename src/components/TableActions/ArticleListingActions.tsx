import style from "./ArticleListingActions.module.scss"
import { FunctionComponent, useContext } from "react"
import { Button } from "../Button"
import { Listing } from "../../types/entities/Listing"
import { DisplayTezos } from "../Display/DisplayTezos"
import { UserContext } from "../../containers/UserProvider"

interface PropsChildren {
  buttons: JSX.Element | null
}

interface Props {
  listing: Listing
  onCancelListing: (listing: Listing) => void
  onAcceptListing: (listing: Listing) => void
  loading: boolean
  disabled: boolean
  children: FunctionComponent<PropsChildren>
}

export function ArticleListingActions({
  listing,
  onCancelListing,
  onAcceptListing,
  loading,
  disabled,
  children,
}: Props) {
  const { user } = useContext(UserContext)

  // the buttons, call to actions for the contracts
  const buttons =
    user?.id === listing.issuer.id ? (
      <Button
        type="button"
        color="primary"
        size="very-small"
        state={loading ? "loading" : "default"}
        disabled={disabled}
        className={style.button}
        onClick={() => onCancelListing(listing)}
      >
        <DisplayTezos
          mutez={listing.price}
          formatBig={false}
          tezosSize="regular"
        />{" "}
        cancel
      </Button>
    ) : (
      <Button
        type="button"
        color="secondary"
        size="very-small"
        state={loading ? "loading" : "default"}
        disabled={disabled}
        className={style.button}
        onClick={() => onAcceptListing(listing)}
      >
        <DisplayTezos
          mutez={listing.price}
          formatBig={false}
          tezosSize="regular"
        />{" "}
        buy one
      </Button>
    )

  return children({
    buttons,
  })
}
