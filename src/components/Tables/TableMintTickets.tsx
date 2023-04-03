import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import style from "./TableUser.module.scss"
import { UserBadge } from "../User/UserBadge"
import Skeleton from "../Skeleton"
import cs from "classnames"
import { MintTicket } from "../../types/entities/MintTicket"
import {
  addDays,
  differenceInSeconds,
  format,
  formatDistanceToNow,
  subSeconds,
} from "date-fns"
import { ButtonClaimMintTicket } from "../MintTicket/ButtonClaimMintTicket"
import { ButtonUpdatePriceMintTicket } from "../MintTicket/ButtonUpdatePriceMintTicket"
import { UserContext } from "../../containers/UserProvider"
import Link from "next/link"
import { Button } from "../Button"
import { Image } from "components/Image"
import { GenTokFlag } from "types/entities/GenerativeToken"
import { useAriaTooltip } from "hooks/useAriaTooltip"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { getFlagText } from "containers/Generative/FlagBanner"

const ModeratedFlag = ({ flag }: { flag: GenTokFlag }) => {
  const { hoverElement, showTooltip, handleEnter, handleLeave } =
    useAriaTooltip()

  return (
    <div onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <FontAwesomeIcon
        className={style.warningIcon}
        ref={hoverElement}
        tabIndex={0}
        onFocus={handleEnter}
        onBlur={handleLeave}
        icon={faTriangleExclamation}
      />

      {showTooltip && (
        <span
          className={style.tooltip}
          role="tooltip"
          aria-hidden={!showTooltip}
          aria-live="polite"
        >
          {getFlagText(flag)}
        </span>
      )}
    </div>
  )
}

interface TableMintTicketsProps {
  firstColName?: string
  displayTokenPreview?: boolean
  mintTickets: MintTicket[]
  loading?: boolean
  refreshEveryMs?: number
}

const _TableMintTickets = ({
  firstColName = "owner",
  displayTokenPreview,
  mintTickets: mintTicketsUnfiltered,
  loading,
  refreshEveryMs = 15000,
}: TableMintTicketsProps) => {
  const [now, setNow] = useState(new Date())
  const { user } = useContext(UserContext)
  const getDAPrice = useCallback(
    (dateNow: Date, dateEnd: Date, price: number) => {
      const dateNowOffset = subSeconds(dateNow, 60)
      const dateEndDayLater = addDays(dateEnd, 1)
      // end of auction
      if (dateEndDayLater < dateNowOffset) {
        return 100000
      }
      // start of auction
      if (dateNowOffset < dateEnd) {
        return price
      }
      const elapsedTimeInSeconds = differenceInSeconds(dateNowOffset, dateEnd)
      const daProgressMultiplier = (elapsedTimeInSeconds * 100) / 86400 / 100
      return 100000 + (price - 100000) * (1 - daProgressMultiplier)
    },
    []
  )
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
            mintTickets.map((mintTicket, i) => {
              const dateTaxPaidUntil = new Date(mintTicket.taxationPaidUntil)
              const isUnderAuction = dateTaxPaidUntil > now
              const price = isUnderAuction
                ? mintTicket.price
                : getDAPrice(now, dateTaxPaidUntil, mintTicket.price)

              const showFlag = isFlagged(mintTicket)

              return (
                <tr
                  key={mintTicket.id}
                  className={cs({ [style["tr-flagged"]]: showFlag })}
                >
                  <td
                    className={cs(style["td-gentk"], style.td_mobile_fullwidth)}
                  >
                    {displayTokenPreview ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <Link
                          href={`/generative/slug/${mintTicket.token.slug}`}
                        >
                          <a className={style.ticketToken}>
                            <div className={cs(style.icon)}>
                              <Image
                                ipfsUri={mintTicket.token.thumbnailUri!}
                                image={mintTicket.token.captureMedia}
                                alt=""
                              />
                            </div>
                            <div className={cs(style.name)}>
                              {mintTicket.token.name}
                            </div>
                          </a>
                        </Link>
                        {showFlag && (
                          <div className={cs(style.flag)}>
                            <ModeratedFlag flag={mintTicket.token.flag} />
                          </div>
                        )}
                      </div>
                    ) : (
                      <UserBadge
                        hasLink
                        user={mintTicket.owner}
                        size="small"
                        displayAvatar={true}
                      />
                    )}
                  </td>

                  <td
                    data-label="Tax paid until"
                    className={cs(style["td-date"], style.td_mobile_fullwidth)}
                  >
                    {format(dateTaxPaidUntil, "dd/MM/yy H:mm")} (
                    {formatDistanceToNow(dateTaxPaidUntil, {
                      addSuffix: true,
                    })}
                    )
                  </td>
                  <td
                    data-label="Actions"
                    className={cs(
                      style["td-mint-actions"],
                      style.td_mobile_fullwidth
                    )}
                  >
                    <div className={style.actions}>
                      {user?.id === mintTicket.owner.id && isUnderAuction ? (
                        <>
                          {!showFlag && (
                            <Link
                              href={`/generative/slug/${mintTicket.token.slug}/ticket/${mintTicket.id}/mint`}
                            >
                              <Button
                                isLink
                                type="button"
                                color="secondary"
                                size="small"
                              >
                                mint iteration
                              </Button>
                            </Link>
                          )}
                          <ButtonUpdatePriceMintTicket
                            mintTicket={mintTicket}
                          />
                        </>
                      ) : (
                        !showFlag && (
                          <ButtonClaimMintTicket
                            mintTicket={mintTicket}
                            price={price}
                            now={now}
                          />
                        )
                      )}
                    </div>
                  </td>
                </tr>
              )
            })
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
