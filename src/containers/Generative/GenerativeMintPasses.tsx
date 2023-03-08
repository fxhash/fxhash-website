import React, { memo } from "react"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { TableMintTickets } from "../../components/Tables/TableMintTickets"

interface GenerativeMintPassesProps {
  token: GenerativeToken
}

const _GenerativeMintPasses = ({ token }: GenerativeMintPassesProps) => {
  return (
    <div>
      <TableMintTickets mintTickets={token.mintTickets} />
    </div>
  )
}

export const GenerativeMintPasses = memo(_GenerativeMintPasses)
