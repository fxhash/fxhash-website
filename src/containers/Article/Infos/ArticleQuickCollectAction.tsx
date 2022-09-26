import { Button } from "../../../components/Button"
import { DisplayTezos } from "../../../components/Display/DisplayTezos"
import { ContractFeedback } from "../../../components/Feedback/ContractFeedback"
import { useContractOperation } from "../../../hooks/useContractOperation"
import { ListingV3AcceptOperation } from "../../../services/contract-operations/ListingV3Accept"
import { NFTArticle } from "../../../types/entities/Article"
import { Listing } from "../../../types/entities/Listing"

interface Props {
  article: NFTArticle
  listing: Listing
}
export function ArticleQuickCollectionAction({
  article,
  listing
}: Props) {
  const {
    call,
    loading,
    state,
    error,
    success,
  } = useContractOperation(ListingV3AcceptOperation)

  return (
    <>
      <ContractFeedback
        state={state}
        loading={loading}
        success={success}
        error={error}
        successMessage="You have successfully collected one edition"
      />

      <Button
        type="button"
        color="secondary"
        size="regular"
        state={loading ? "loading" : "default"}
        disabled={loading}
        onClick={() => {
          call({
            listing: listing,
            article: article,
            amount: 1
          })
        }}
      >
        collect one edition{" "}
        <DisplayTezos
          formatBig={false}
          mutez={listing.price}
          tezosSize="regular"
        />
      </Button>
    </>
  )
}