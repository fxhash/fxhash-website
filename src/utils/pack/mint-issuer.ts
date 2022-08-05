import { EBuildableParams, pack } from "../../services/parameters-builder/BuildParameters"
import { TInputMintIssuer } from "../../services/parameters-builder/mint-issuer/input"

export function packMintIssuer(
  input: TInputMintIssuer<number, string>
): string {
  return pack(input, EBuildableParams.MINT_ISSUER)
}