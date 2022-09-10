import { FunctionComponent } from "react"
import { Button } from "../Button"
import { Listing } from "../../types/entities/Listing";
import { DisplayTezos } from "../Display/DisplayTezos";

interface PropsChildren {
  buttons: JSX.Element | null
}

interface Props {
  listing: Listing
  children: FunctionComponent<PropsChildren>
}

export function ArticleListingActions({
  listing,
  children,
}: Props) {

  // the buttons, call to actions for the contracts
  const buttons = (
    <Button
      type="button"
      color="secondary"
      size="very-small"
    >
      <DisplayTezos mutez={listing.price} formatBig={false} tezosSize="regular" /> buy one
    </Button>
  )

  return children({
    buttons,
  })
}
