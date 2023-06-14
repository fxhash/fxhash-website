import React, { memo, useEffect, useState } from "react"
import cs from "classnames"
import { GenTokFlag } from "types/entities/GenerativeToken"
import { MintTicket } from "types/entities/MintTicket"
import Skeleton from "../../Skeleton"
import style from "../TableUser.module.scss"
import { MintTicketRow } from "./MintTicketRow"

interface TableMintTicketsProps {
  firstColName?: string
  displayTokenPreview?: boolean
  mintTickets: MintTicket[]
  loading?: boolean
  refreshEveryMs?: number
  updateCacheOnForeclosure?: boolean
}

const _TableMintTickets = ({
  firstColName = "owner",
  displayTokenPreview,
  mintTickets: mintTicketsUnfiltered = [],
  loading,
  refreshEveryMs = 15000,
  updateCacheOnForeclosure = false,
}: TableMintTicketsProps) => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, refreshEveryMs)
    return () => {
      clearInterval(interval)
    }
  }, [refreshEveryMs])

  const isInForeclosure = (mintTicket: MintTicket) => {
    const dateTaxPaidUntil = new Date(mintTicket.taxationPaidUntil)
    return dateTaxPaidUntil <= now
  }

  const isFlagged = (mintTicket: MintTicket) => {
    const isMalicious = mintTicket.token.flag === GenTokFlag.MALICIOUS
    const isHidden = mintTicket.token.flag === GenTokFlag.HIDDEN
    return isMalicious || isHidden
  }

  /**
   * if a ticket is associated with a moderated token we hide the
   * claim action - if the ticket is in foreclosure we simply hide
   * the entire ticket as there will be no available actions.
   */
  const shouldHideTicket = (mintTicket: MintTicket) =>
    isFlagged(mintTicket) && isInForeclosure(mintTicket)

  const mintTickets = mintTicketsUnfiltered.filter(
    (mintTicket) => !shouldHideTicket(mintTicket)
  )

  return (
    <>
      {firstColName && (
        <div className={style.mobile_table_title}>{firstColName}</div>
      )}
      <table className={cs(style.table)}>
        <thead>
          <tr>
            <th className={style["th-gentk"]}>{firstColName}</th>
            <th className={style["th-date"]}>Tax paid until</th>
            <th className={style["th-mint-actions"]}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading || mintTickets.length > 0 ? (
            mintTickets.map((mintTicket, i) => (
              <MintTicketRow
                key={mintTicket.id}
                mintTicket={mintTicket}
                now={now}
                showFlag={isFlagged(mintTicket)}
                displayTokenPreview={displayTokenPreview}
                updateCacheOnForeclosure={updateCacheOnForeclosure}
              />
            ))
          ) : (
            <tr>
              <td
                className={cs(style.empty, style.td_mobile_fullwidth)}
                colSpan={5}
              >
                No mint tickets found
              </td>
            </tr>
          )}
          {loading &&
            [...Array(29)].map((_, idx) => (
              <tr key={idx}>
                <td className={style["td-gentk"]}>
                  <div className={style["skeleton-wrapper"]}>
                    <Skeleton
                      className={style["skeleton-thumbnail"]}
                      height="40px"
                      width="40px"
                    />
                    <Skeleton height="25px" width="100%" />
                  </div>
                </td>
                <td
                  data-label="Tax paid until"
                  className={cs(style["td-date"], style.td_mobile_fullwidth)}
                >
                  <Skeleton height="25px" />
                </td>
                <td
                  data-label="Actions"
                  className={cs(
                    style["td-mint-actions"],
                    style.td_mobile_fullwidth
                  )}
                >
                  <Skeleton height="25px" />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  )
}

export const TableMintTickets = memo(_TableMintTickets)
