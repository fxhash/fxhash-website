import style from "./MarketplaceActions.module.scss"
import cs from "classnames"
import { useMemo, useState } from "react"
import { Button } from "../../components/Button"
import { InputTextUnit } from "../../components/Input/InputTextUnit"
import { Objkt } from "../../types/entities/Objkt"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import { useContractOperation } from "../../hooks/useContractOperation"
import {
  ListingOperation,
  TListingOperationParams,
} from "../../services/contract-operations/Listing"
import { TextWarning } from "../../components/Text/TextWarning"
import { DisplayTezos } from "../../components/Display/DisplayTezos"
import { IconTezos } from "../../components/Icons/IconTezos"

interface Props {
  objkt: Objkt
  defaultOpen?: boolean
  onSuccess?: () => void
}

export function ListingCreate({
  objkt,
  onSuccess,
  defaultOpen = false,
}: Props) {
  const [opened, setOpened] = useState<boolean>(defaultOpen)
  const [price, setPrice] = useState<string>("")

  const {
    state,
    loading: contractLoading,
    error: contractError,
    success,
    call,
  } = useContractOperation<TListingOperationParams>(ListingOperation, {
    onSuccess,
  })

  const callContract = () => {
    const mutez = Math.floor(parseFloat(price) * 1000000)
    if (isNaN(mutez)) {
      alert("Invalid price")
    } else {
      call({
        token: objkt,
        price: mutez,
      })
    }
  }

  const floor = useMemo(
    () => objkt.issuer?.marketStats?.floor || 0,
    [objkt.issuer?.marketStats?.floor]
  )
  const showWarningListingTooLow = useMemo(() => {
    const mutez = parseFloat(price) * 1000000
    const isFloorOver100tz = floor > 100 * 1000000
    const isPriceUnderHalfFloor = price !== undefined && mutez <= floor * 0.5
    return isFloorOver100tz && isPriceUnderHalfFloor
  }, [floor, price])
  return (
    <>
      <ContractFeedback
        state={state}
        loading={contractLoading}
        success={success}
        error={contractError}
        successMessage="Your Gentk has been listed"
      />

      {opened ? (
        <>
          {showWarningListingTooLow && (
            <TextWarning>
              Your listing is priced way under the&nbsp;floor&nbsp;(
              <DisplayTezos mutez={floor} />)
            </TextWarning>
          )}
          <div className={cs(style.inputs)}>
            <InputTextUnit
              unit={<IconTezos size="regular" />}
              positionUnit="inside-left"
              type="number"
              sizeX="fill"
              value={price}
              onChange={(evt) => setPrice(evt.target.value)}
              min={0}
              step={0.0000001}
              className={style.input}
            />
            <Button
              state={contractLoading ? "loading" : "default"}
              color="secondary"
              onClick={callContract}
              size="regular"
              disabled={!price}
              className={style.button_listing}
            >
              list
            </Button>
          </div>
        </>
      ) : (
        <Button
          color={opened ? "primary" : "secondary"}
          onClick={() => setOpened(!opened)}
          className={style.button}
        >
          list for trade
        </Button>
      )}
    </>
  )
}
