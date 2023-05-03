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
import { Error as ErrorFeedback } from "components/Error/Error"
import { Tabs } from "../../components/Layout/Tabs"
import { getGentkLocalID } from "utils/entities/gentk"

const tabs = [
  {
    key: "sign",
    name: "1. Sign your inputs",
  },
  {
    key: "redeem",
    name: "2. Redeem your token",
  },
]

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
  const [activeTabIdx, setActiveTabIdx] = useState(0)
  const { walletManager: wallet, user } = useContext(UserContext)
  const [redemptionPayload, setRedemptionPayload] =
    useState<PrepareRedemptionPayload | null>(null)
  const [signError, setSignError] = useState<string | null>(null)
  const [signLoading, setSignLoading] = useState(false)

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
      setSignError(null)
      setSignLoading(true)

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
            tokenId: getGentkLocalID(gentk.id),
          }),
        }
      )

      if (response.status !== 200) {
        const err = await response.json()
        throw new Error(err?.error)
      }

      const backendData: PrepareRedemptionPayload = await response.json()
      setRedemptionPayload(backendData)
      setActiveTabIdx(1)
      setSignLoading(false)
    } catch (error: any) {
      setSignError(error?.message || "Unknown error")
      setSignLoading(false)
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

      <div>
        <Tabs
          tabDefinitions={tabs}
          activeIdx={activeTabIdx}
          tabsLayout="full-width"
        />
      </div>
      {activeTabIdx === 0 && (
        <>
          <p className={cs(text.small)}>
            Because some of the data required to redeem your token is sensitive,
            it will not be sent on the blockchain. Instead, this data will be
            stored on our backend. Signing the data ensures that your wallet was
            responsible for sending your inputs to our servers. Once you will
            redeem your token on the second step, our backend will match your
            inputs with the redemption event.
          </p>

          {signError && <ErrorFeedback>{signError}</ErrorFeedback>}

          <Submit>
            <Button
              type="button"
              color="secondary"
              size="small"
              onClick={() => sign()}
              disabled={!!redemptionPayload}
              state={signLoading ? "loading" : "default"}
            >
              Sign your inputs
            </Button>
          </Submit>
        </>
      )}
      {activeTabIdx === 1 && (
        <>
          <p className={cs(text.small)}>
            Now that we have properly received your inputs on our servers, you
            can redeem the token. This will make a call to the Smart Contract to
            mark this token as redeemed, and we will link it to the inputs we've
            just received.
          </p>

          <Spacing size="large" />

          <ContractFeedback
            state={state}
            loading={loading}
            success={success}
            error={error}
            successMessage={redeemable.successInfos}
          />

          <Submit className={cs(style.submit)}>
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
        </>
      )}
    </Modal>
  )
}
