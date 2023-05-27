import { Spacing } from "components/Layout/Spacing"
import { UpdateIssuerV3Operation } from "services/contract-operations/UpdateIssuerV3"
import { GenerativeToken } from "types/entities/GenerativeToken"
import { BurnEditions } from "../Shared/BurnEditions"
import { BurnToken } from "../Shared/BurnToken"
import { EditGeneralSettings } from "../Shared/EditGeneralSettings"
import { EditPricing } from "./EditPricing"
import { EditReserves } from "../Shared/EditReserves"
import { UpdateReservesV3Operation } from "services/contract-operations/UpdateReserveV3"
import { BurnSupplyV3Operation } from "services/contract-operations/BurnSupplyV3"
import { BurnTokenV3Operation } from "services/contract-operations/BurnTokenV3"

interface Props {
  token: GenerativeToken
}
export function EditTokenV3({ token }: Props) {
  return (
    <>
      <EditGeneralSettings
        token={token}
        contractOperation={UpdateIssuerV3Operation}
      />
      <Spacing size="6x-large" />
      <EditPricing token={token} />
      <Spacing size="6x-large" />
      <EditReserves
        token={token}
        contractOperation={UpdateReservesV3Operation}
      />
      <Spacing size="6x-large" />
      <BurnEditions token={token} contractOperation={BurnSupplyV3Operation} />
      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
      <BurnToken token={token} contractOperation={BurnTokenV3Operation} />
    </>
  )
}
