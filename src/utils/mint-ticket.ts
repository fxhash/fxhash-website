import { MintTicket } from "../types/entities/MintTicket"
import { FxhashContracts } from "../types/Contracts"
import { getDiffByPath } from "./indexing"
import { User } from "../types/entities/User"
import { getTaxPaidUntil } from "./math"
import { GenerativeToken } from "../types/entities/GenerativeToken"
import { TzktOperation } from "../types/Tzkt"

export const generateMintTicketFromMintAction = (
  opData: TzktOperation[],
  token: GenerativeToken,
  user: User
): MintTicket | null => {
  // find mint operation on tickets contract
  const ticketMintOp = opData.find(
    (op) =>
      op.parameter?.entrypoint === "mint" &&
      op.target?.address === FxhashContracts.MINT_TICKETS_V3
  )
  if (!ticketMintOp) return null
  // find the diff in ledger storage
  const ledgerDiff = getDiffByPath(ticketMintOp.diffs, "ledger")
  const tokenDataLedger = getDiffByPath(ticketMintOp.diffs, "token_data")
  if (!ledgerDiff || !tokenDataLedger) return null
  // return token ID, key of the ledger diff update
  const values = tokenDataLedger.content.value
  const price = parseInt(values.price)
  return {
    id: parseInt(ledgerDiff.content.key),
    token,
    owner: user as User,
    createdAt: values.created_at,
    price,
    taxationLocked: values.taxation_locked,
    taxationStart: values.taxation_start,
    taxationPaidUntil: getTaxPaidUntil(
      parseInt(values.taxation_locked),
      new Date(values.taxation_start),
      price
    ),
    settings: token.mintTicketSettings!,
  }
}
