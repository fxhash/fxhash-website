import style from "./StepCheckFiles.module.scss"
import styleSteps from "./Steps.module.scss"
import cs from "classnames"
import { StepComponent } from "../../types/Steps"
import { getIpfsSlash } from "../../utils/ipfs"
import { Spacing } from "../../components/Layout/Spacing"
import { Button } from "../../components/Button"
import { useContext, useEffect, useMemo } from "react"
import {
  generativeFromMintForm,
  generativeMetadataFromMintForm,
} from "../../utils/generative-token"
import { UserContext } from "../UserProvider"
import { User } from "../../types/entities/User"
import { GenerativeDisplay } from "../Generative/Display/GenerativeDisplay"
import useFetch, { CachePolicies } from "use-http"
import { MetadataError, MetadataResponse } from "../../types/Responses"
import { useContractOperation } from "../../hooks/useContractOperation"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import {
  MintIssuerOperation,
  TMintIssuerOperationParams,
} from "../../services/contract-operations/MintIssuer"
import { stringToByteString } from "../../utils/convert"

export const StepPreviewMint: StepComponent = ({ onNext, state }) => {
  const userCtx = useContext(UserContext)
  const user = userCtx.user!

  // we build a metadata object from the state (can be uploaded)
  const metadata = useMemo(() => generativeMetadataFromMintForm(state), [state])

  // we build a fake generative token object from state & metadata
  const token = useMemo(
    () => generativeFromMintForm(state, metadata, user as User),
    [state, metadata, user]
  )

  // hook to interact with file API metadata
  const {
    data: metaData,
    loading: metaLoading,
    error: metaError,
    post: metaPost,
  } = useFetch<MetadataResponse | MetadataError>(
    `${process.env.NEXT_PUBLIC_API_FILE_ROOT}/metadata`,
    {
      cachePolicy: CachePolicies.NO_CACHE,
    }
  )

  // hook to interact with the contract
  const {
    state: callState,
    loading: contractLoading,
    error: contractError,
    success,
    call,
  } = useContractOperation<TMintIssuerOperationParams>(MintIssuerOperation)

  // this variable ensures that we can safely access its data regardless of
  // the state of the queries
  const safeMetaData: MetadataResponse | false | undefined =
    !metaError && !metaLoading && (metaData as MetadataResponse)

  // when we receive metadata CID, we can initiate the call to contract
  useEffect(() => {
    if (safeMetaData) {
      const metadataCid = safeMetaData.cid
      // call the contract
      // it will handle either a call to the issuer or to the collaboration
      // contract if target is collaboration
      call({
        data: state,
        metadata: metadata,
        metadataBytes: stringToByteString(getIpfsSlash(metadataCid)),
      })
    }
  }, [safeMetaData])

  // when the contract call is a success, we move to next step
  useEffect(() => {
    if (success) {
      onNext({
        minted: true,
      })
    }
  }, [success])

  // derived from state, to take account for both side-effects interactions
  const loading = metaLoading || contractLoading

  return (
    <>
      <p>
        Take a final look to check if the project is properly configured.
        <br />
        This preview is generated based on the settings which will be minted.
      </p>

      <Spacing size="6x-large" sm="none" />
      <Spacing size="3x-large" sm="none" />

      <div className={cs(style.container)}>
        <GenerativeDisplay token={token} offlineMode />
      </div>

      <Spacing size="6x-large" sm="none" />
      <Spacing size="3x-large" sm="x-large" />

      <section className={cs(styleSteps.bottom)}>
        <ContractFeedback
          state={callState}
          loading={contractLoading}
          success={success}
          error={contractError}
          successMessage="Success !"
        />

        <Button
          color="secondary"
          iconComp={<i aria-hidden className="fa-solid fa-book-sparkles" />}
          iconSide="right"
          size="large"
          state={loading ? "loading" : "default"}
          onClick={() => metaPost(metadata)}
          className={style.button}
        >
          publish project
        </Button>
      </section>

      <Spacing size="3x-large" />
      <Spacing size="3x-large" sm="none" />
      <Spacing size="3x-large" sm="none" />
    </>
  )
}
