import style from "./RedeemModal.module.scss"
import text from "styles/Text.module.css"
import cs from "classnames"
import { Modal } from "components/Utils/Modal"
import { Objkt } from "types/entities/Objkt"
import { RedeemableDetails } from "types/entities/Redeemable"
import { Inputs as RedeemInputs } from "./RedeemForm"
import { Spacing } from "components/Layout/Spacing"
import { Button } from "components/Button"
import { Submit } from "components/Form/Submit"
import { useContext, useMemo, useState } from "react"
import { UserContext } from "containers/UserProvider"
import { fetchRetry } from "utils/network"
import { redeemTotalCost } from "utils/entities/redeem"
import { DisplayTezos } from "components/Display/DisplayTezos"
import { useContractOperation } from "hooks/useContractOperation"
import { RedeemTokenOperation } from "services/contract-operations/RedeemToken"
import { ContractFeedback } from "components/Feedback/ContractFeedback"

interface PrepareRedemptionPayload {
  payload: {
    consumer: string
    options: number[]
    salt: string
    token_id: number
  }
  signature: string
}

interface Props {
  title: string
  onClose: () => void
  gentk: Objkt
  redeemable: RedeemableDetails
  inputs: RedeemInputs
}
export function RedeemModal({
  title,
  onClose,
  gentk,
  redeemable,
  inputs,
}: Props) {
  const { walletManager: wallet, user } = useContext(UserContext)
  const [redemptionPayload, setRedemptionPayload] =
    useState<PrepareRedemptionPayload | null>(null)

  const { call, state, loading, error, success } =
    useContractOperation(RedeemTokenOperation)

  const cost = useMemo(
    () => redeemTotalCost(redeemable, inputs.options),
    [redeemable, inputs.options]
  )

  const sign = async () => {
    if (!wallet || !user) return
    try {
      setRedemptionPayload(null)

      // prepare and sign the inputs to authenticate those on the backend
      const data = JSON.stringify(inputs)
      const { payload, payloadBytes, signature } = await wallet?.signString(
        data
      )
      // prepare the redemption on the server - it should insert the details in
      // the database and in case of success will output a payload and a
      // signature which can be used to redeem the token onchain
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_EVENTS_ROOT}/prepare-redemption`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payload,
            payloadBytes,
            signature: signature?.signature,
            publicKey: (
              await wallet.beaconWallet!.client.getActiveAccount()
            )?.publicKey,
            redeemableAddress: redeemable.address,
            tokenId: gentk.id,
          }),
        }
      )
      const backendData: PrepareRedemptionPayload = await response.json()
      setRedemptionPayload(backendData)
    } catch (error) {
      // todo: process error more properly
      console.log(error)
    }
  }

  const redeem = () => {
    if (redemptionPayload) {
      call({
        payload: redemptionPayload.payload,
        signature: redemptionPayload.signature,
        redeemable: redeemable,
        token: gentk,
      })
    }
  }

  return (
    <Modal title={title} onClose={onClose}>
      <span className={cs(text.info)}>
        You are about to redeem <strong>{gentk.name}</strong> to get{" "}
        <strong>{redeemable.name}</strong>.
        <br />
        Please note that you will keep ownership of <em>{gentk.name}</em>{" "}
        afterwards.
      </span>

      <Spacing size="x-large" />

      <h4>1. Sign your inputs</h4>

      <p className={cs(text.small)}>
        Because some of the data required to redeem your token is sensitive, it
        will not be sent on the blockchain. Instead, this data will be stored on
        our backend. Signing the data ensures that your wallet was responsible
        for sending your inputs to our servers. Once you will redeem your token
        on the second step, our backend will match your inputs with the
        redemption event.
      </p>

      <Submit>
        <Button
          type="button"
          color="secondary"
          size="small"
          onClick={() => sign()}
          disabled={!!redemptionPayload}
        >
          Sign your inputs
        </Button>
      </Submit>

      <Spacing size="3x-large" />

      <h4>2. Redeem your token</h4>

      <p className={cs(text.small)}>
        Now that we have properly received your inputs on our servers, you can
        redeem the token. This will make a call to the Smart Contract to mark
        this token as redeemed, and we will link it to the inputs we've just
        received.
      </p>

      <ContractFeedback
        state={state}
        loading={loading}
        success={success}
        error={error}
        successMessage={redeemable.successInfos}
      />

      <Submit>
        <Button
          type="button"
          color="secondary"
          size="small"
          disabled={!redemptionPayload}
          state={loading ? "loading" : "default"}
          onClick={redeem}
        >
          Redeem your token&nbsp;&nbsp;
          <DisplayTezos mutez={cost} formatBig={false} />
        </Button>
      </Submit>
    </Modal>
  )
}
