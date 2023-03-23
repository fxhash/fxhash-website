import { Spacing } from "components/Layout/Spacing"
import { UpdateIssuerOperation } from "services/contract-operations/UpdateIssuer"
import { GenerativeToken } from "types/entities/GenerativeToken"
import { BurnEditions } from "../Shared/BurnEditions"
import { BurnToken } from "../Shared/BurnToken"
import { EditGeneralSettings } from "../Shared/EditGeneralSettings"
import { EditPricing } from "./EditPricing"
import { EditReserves } from "../Shared/EditReserves"
import { UpdateReservesOperation } from "services/contract-operations/UpdateReserve"
import { BurnSupplyOperation } from "services/contract-operations/BurnSupply"
import { BurnTokenOperation } from "services/contract-operations/BurnToken"

interface Props {
  token: GenerativeToken
}
export function EditTokenPreV3({ token }: Props) {
  return (
    <>
      <EditGeneralSettings
        token={token}
        contractOperation={UpdateIssuerOperation}
      />
      <Spacing size="6x-large" />
      <EditPricing token={token} />
      <Spacing size="6x-large" />
      <EditReserves token={token} contractOperation={UpdateReservesOperation} />
      <Spacing size="6x-large" />
      <BurnEditions token={token} contractOperation={BurnSupplyOperation} />
      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
      <BurnToken token={token} contractOperation={BurnTokenOperation} />
    </>
  )
}
