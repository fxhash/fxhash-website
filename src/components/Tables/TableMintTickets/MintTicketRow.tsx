import { memo, useContext, useEffect, useRef } from "react"
import Link from "next/link"
import cs from "classnames"
import {
  addDays,
  differenceInSeconds,
  format,
  formatDistanceToNow,
  isBefore,
  subSeconds,
} from "date-fns"
import { Image } from "components/Image"
import { UserContext } from "containers/UserProvider"
import { MintTicket } from "types/entities/MintTicket"
import style from "../TableUser.module.scss"
import { ModeratedFlag } from "./ModeratedFlag"
import { UserBadge } from "components/User/UserBadge"
import { Button } from "components/Button"
import { ButtonUpdatePriceMintTicket } from "components/MintTicket/ButtonUpdatePriceMintTicket"
import { ButtonClaimMintTicket } from "components/MintTicket/ButtonClaimMintTicket"
import { ApolloCache, useApolloClient } from "@apollo/client"
import { Qu_genTokenMintTickets } from "queries/generative-token"
import { GenerativeToken } from "types/entities/GenerativeToken"
import { Frag_MintTicketFull } from "queries/fragments/mint-ticket"

const getDAPrice = (dateNow: Date, dateEnd: Date, price: number) => {
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
}

const moveMintTicketToUnderAuction = (
  cache: ApolloCache<any>,
  mintTicket: MintTicket
) => {
  cache.modify({
    id: cache.identify({
      __typename: "GenerativeToken",
      id: mintTicket.token.id,
    }),
    fields: {
      // add the mint ticket to the list of under auction mint tickets
      underAuctionMintTickets(existing = [], { toReference }) {
        const mintTicketRef = toReference({
          __typename: "MintTicket",
          id: mintTicket.id,
        })
        return [mintTicketRef, ...existing]
      },
      // remove it from the list of unused mint tickets
      mintTickets(existing = [], { readField }) {
        return existing.filter(
          (mintTicketRef: any) =>
            mintTicket.id !== readField("id", mintTicketRef)
        )
      },
    },
  })
}

interface MintTicketRowProps {
  mintTicket: MintTicket
  now: Date
  displayTokenPreview?: boolean
  showFlag?: boolean
  updateCacheOnForeclosure?: boolean
}

const _MintTicketRow = ({
  mintTicket,
  now,
  displayTokenPreview,
  showFlag = false,
  updateCacheOnForeclosure = false,
}: MintTicketRowProps) => {
  const { user } = useContext(UserContext)
  const { cache } = useApolloClient()

  const dateTaxPaidUntil = new Date(mintTicket.taxationPaidUntil)
  const isUnderAuction = isBefore(dateTaxPaidUntil, now)
  const lastIsUnderAuction = useRef(isUnderAuction)

  const price = !isUnderAuction
    ? mintTicket.price
    : getDAPrice(now, dateTaxPaidUntil, mintTicket.price)

  useEffect(() => {
    if (!updateCacheOnForeclosure) return

    // when going from not under auction to under auction
    if (isUnderAuction && !lastIsUnderAuction.current) {
      moveMintTicketToUnderAuction(cache, mintTicket)
    }
    lastIsUnderAuction.current = isUnderAuction
  }, [isUnderAuction])

  return (
    <tr key={mintTicket.id} className={cs({ [style["tr-flagged"]]: showFlag })}>
      <td className={cs(style["td-gentk"], style.td_mobile_fullwidth)}>
        {displayTokenPreview ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Link href={`/generative/slug/${mintTicket.token.slug}`}>
              <a className={style.ticketToken}>
                <div className={cs(style.icon)}>
                  <Image
                    ipfsUri={mintTicket.token.thumbnailUri!}
                    image={mintTicket.token.captureMedia}
                    alt=""
                  />
                </div>
                <div className={cs(style.name)}>{mintTicket.token.name}</div>
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
        className={cs(style["td-mint-actions"], style.td_mobile_fullwidth)}
      >
        <div className={style.actions}>
          {user?.id === mintTicket.owner.id && !isUnderAuction ? (
            <>
              {!showFlag && (
                <Link
                  href={`/generative/slug/${mintTicket.token.slug}/ticket/${mintTicket.id}/mint`}
                >
                  <Button isLink type="button" color="secondary" size="small">
                    mint iteration
                  </Button>
                </Link>
              )}
              <ButtonUpdatePriceMintTicket mintTicket={mintTicket} />
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
}

export const MintTicketRow = memo(_MintTicketRow)
