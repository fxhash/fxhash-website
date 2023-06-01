import style from "./MarketplaceActions.module.scss"
import cs from "classnames"
import { useCallback, useMemo, useState } from "react"
import { Button } from "../../components/Button"
import { InputTextUnit } from "../../components/Input/InputTextUnit"
import { Objkt } from "../../types/entities/Objkt"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import { useContractOperation } from "../../hooks/useContractOperation"
import { TextWarning } from "../../components/Text/TextWarning"
import { DisplayTezos } from "../../components/Display/DisplayTezos"
import { IconTezos } from "../../components/Icons/IconTezos"
import {
  ListingUpsertOperation,
  TListingUpsertOperationParams,
} from "../../services/contract-operations/ListingUpsert"

interface Props {
  objkt: Objkt
  defaultPrice?: number
  onSuccess?: () => void
  onChangePrice?: (price: string) => void
}

export function ListingUpsert({
  objkt,
  defaultPrice,
  onSuccess,
  onChangePrice,
}: Props) {
  const [price, setPrice] = useState<string>(
    defaultPrice ? defaultPrice.toString() : ""
  )

  const {
    state,
    loading: contractLoading,
    error: contractError,
    success,
    call,
  } = useContractOperation<TListingUpsertOperationParams>(
    ListingUpsertOperation,
    {
      onSuccess,
    }
  )

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

  const handleChangePrice = useCallback(
    (evt) => {
      const newPrice = evt.target.value
      setPrice(newPrice)
      if (onChangePrice) {
        onChangePrice(newPrice)
      }
    },
    [onChangePrice]
  )
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
        successMessage="Your listing price has been updated"
      />
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
          onChange={handleChangePrice}
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
          update
        </Button>
      </div>
    </>
  )
}
