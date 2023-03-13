import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
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

interface TableMintTicketsProps {
  firstColName?: string
  displayTokenPreview?: boolean
  mintTickets: MintTicket[]
  loading?: boolean
}
const _TableMintTickets = ({
  firstColName = "owner",
  displayTokenPreview,
  mintTickets,
  loading,
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
    }, 15000)
    return () => {
      clearTimeout(interval)
    }
  }, [])
  return (
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
          mintTickets.map((mintTicket) => {
            const dateTaxPaidUntil = new Date(mintTicket.taxationPaidUntil)
            const isUnderAuction = dateTaxPaidUntil > now
            const price = isUnderAuction
              ? mintTicket.price
              : getDAPrice(now, dateTaxPaidUntil, mintTicket.price)
            return (
              <tr key={mintTicket.id}>
                <td
                  className={cs(style["td-gentk"], style.td_mobile_fullwidth)}
                >
                  {displayTokenPreview ? (
                    <Link href={`/generative/slug/${mintTicket.token.slug}`}>
                      <a className={style.ticketToken}>
                        <div className={cs(style.icon)}>
                          <Image
                            ipfsUri={mintTicket.token.thumbnailUri!}
                            image={mintTicket.token.captureMedia}
                            alt=""
                          />
                        </div>
                        <div className={style.name}>
                          {mintTicket.token.name}
                        </div>
                      </a>
                    </Link>
                  ) : (
                    <UserBadge
                      hasLink
                      user={mintTicket.owner}
                      size="small"
                      displayAvatar={true}
                    />
                  )}
                </td>

                <td data-label="Tax paid until" className={style["td-date"]}>
                  {format(dateTaxPaidUntil, "dd/MM/yy H:mm")} (
                  {formatDistanceToNow(dateTaxPaidUntil, {
                    addSuffix: true,
                  })}
                  )
                </td>
                <td data-label="Actions" className={style["td-mint-actions"]}>
                  <div className={style.actions}>
                    {user?.id === mintTicket.owner.id && isUnderAuction ? (
                      <>
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
                        <ButtonUpdatePriceMintTicket mintTicket={mintTicket} />
                      </>
                    ) : (
                      <ButtonClaimMintTicket
                        mintTicket={mintTicket}
                        price={price}
                        now={now}
                      />
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
              <td data-label="Seller" className={style["td-date"]}>
                <Skeleton height="25px" />
              </td>
              <td data-label="Time" className={style["td-mint-actions"]}>
                <Skeleton height="25px" />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}

export const TableMintTickets = memo(_TableMintTickets)
