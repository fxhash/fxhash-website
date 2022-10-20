import React, { memo, useCallback, useContext, useState } from "react"
import style from "./TableUser.module.scss"
import text from "../../styles/Text.module.css"
import { UserBadge } from "../User/UserBadge"
import Skeleton from "../Skeleton"
import { Listing } from "../../types/entities/Listing"
import { ArticleListingActions } from "../TableActions/ArticleListingActions"
import { DateDistance } from "../Utils/Date/DateDistance"
import cs from "classnames"
import { Ledger } from "../../types/entities/Ledger"
import { ArticleListEditions } from "../Article/Actions/ArticleListEditions"
import { NFTArticle } from "../../types/entities/Article"
import { UserContext } from "../../containers/UserProvider"
import { useContractOperation } from "../../hooks/useContractOperation"
import { ListingV3CancelOperation } from "../../services/contract-operations/ListingV3Cancel"
import { ContractFeedback } from "../Feedback/ContractFeedback"
import { ListingV3AcceptOperation } from "../../services/contract-operations/ListingV3Accept"

interface TableArticleListingsProps {
  article: NFTArticle
  listings: Listing[]
  ledgers: Ledger[]
  loading?: boolean
}
const _TableArticleListings = ({
  article,
  listings,
  ledgers,
  loading,
}: TableArticleListingsProps) => {
  const { user } = useContext(UserContext)

  // keeps the listing on which an operation is called
  const [listingOperated, setListingOperated] = useState<Listing | null>(null)
  const [opType, setOpType] = useState<"cancel" | "accept">("cancel")

  const {
    call: cancelCall,
    loading: cancelLoading,
    state: cancelState,
    success: cancelSuccess,
    error: cancelError,
  } = useContractOperation(ListingV3CancelOperation)

  const {
    call: acceptCall,
    loading: acceptLoading,
    state: acceptState,
    success: acceptSuccess,
    error: acceptError,
  } = useContractOperation(ListingV3AcceptOperation)

  const cancelListing = useCallback((listing: Listing) => {
    setListingOperated(listing)
    setOpType("cancel")
    cancelCall({
      listing: listing,
      article: article,
    })
  }, [])

  const acceptListing = useCallback((listing: Listing) => {
    setListingOperated(listing)
    setOpType("accept")
    acceptCall({
      listing: listing,
      amount: 1,
      article: article,
    })
  }, [])

  // & on calls
  const contractLoading = cancelLoading || acceptLoading

  return (
    <div className={style.wrapper_scrollable_x}>
      <table className={style.table}>
        <thead>
          <tr>
            <th className={style["th-user"]}>User</th>
            <th className={cs(style["th-editions"], style["th-center"])}>
              Editions
            </th>
            <th className={cs(style["th-time"], style["th-center"])}>Time</th>
            <th className={cs(style["th-listing-actions"], style["th-right"])}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {loading || listings.length > 0 ? (
            listings.map((listing) => (
              <ArticleListingActions
                key={`${listing.id}-${listing.version}`}
                listing={listing}
                onCancelListing={cancelListing}
                onAcceptListing={acceptListing}
                loading={contractLoading && listing.id === listingOperated?.id}
                disabled={contractLoading}
              >
                {({ buttons }) => (
                  <>
                    {listingOperated?.id === listing.id && (
                      <tr style={{ borderBottom: "none" }}>
                        <td colSpan={4}>
                          <div
                            className={style.article_actions}
                            style={{
                              marginRight: 2,
                            }}
                          >
                            {opType === "cancel" && (
                              <ContractFeedback
                                state={cancelState}
                                loading={cancelLoading}
                                success={cancelSuccess}
                                error={cancelError}
                                successMessage="Listing cancelled successfully"
                                noSpacing
                              />
                            )}
                            {opType === "accept" && (
                              <ContractFeedback
                                state={acceptState}
                                loading={acceptLoading}
                                success={acceptSuccess}
                                error={acceptError}
                                successMessage="Listing accepted successfully"
                                noSpacing
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                    <tr
                      className={cs({
                        [style.light_border_color]:
                          listing.id === listingOperated?.id,
                      })}
                    >
                      <td className={style["td-gentk"]} data-label="User">
                        <UserBadge hasLink user={listing.issuer} size="small" />
                      </td>
                      <td
                        className={cs(style["td-editions"], style["td-center"])}
                        data-label="Editions"
                      >
                        <span className={text.bold}>{listing.amount}</span>
                      </td>
                      <td
                        className={cs(style["td-time"], style["td-center"])}
                        data-label="Time"
                      >
                        <div className={cs(text.info)}>
                          <DateDistance timestamptz={listing.createdAt} />
                        </div>
                      </td>
                      <td
                        data-label="Action"
                        className={cs({
                          [style.td_mobile_hide]: !buttons,
                        })}
                      >
                        <div className={style.article_actions}>{buttons}</div>
                      </td>
                    </tr>
                  </>
                )}
              </ArticleListingActions>
            ))
          ) : (
            <tr>
              <td
                className={cs(style.empty, style.td_mobile_fullwidth)}
                colSpan={4}
              >
                No listings found
              </td>
            </tr>
          )}
          <tr className={style.tr_separator}>
            <td colSpan={4} />
          </tr>
          {loading ||
            (ledgers.length > 0 &&
              ledgers.map((ledger, idx) => (
                <tr key={ledger.owner?.id || idx}>
                  <td className={style["td-gentk"]} data-label="User">
                    <UserBadge hasLink user={ledger.owner} size="small" />
                  </td>
                  <td
                    className={cs(style["td-editions"], style["td-center"])}
                    data-label="Editions"
                  >
                    <span className={text.bold}>{ledger.amount}</span>
                  </td>
                  <td colSpan={1} className={style.td_mobile_hide} />
                  <td
                    className={cs({
                      [style.td_mobile_fullwidth]: true,
                      [style.td_mobile_hide]: !(user?.id === ledger.owner.id),
                    })}
                    data-label="Action"
                  >
                    <div className={style.article_actions}>
                      {user?.id === ledger.owner.id && (
                        <ArticleListEditions
                          ledger={ledger}
                          article={article}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              )))}
          {loading &&
            [...Array(10)].map((_, idx) => (
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
                <td className={style["td-user"]}>
                  <Skeleton height="25px" />
                </td>
                <td className={style["td-price"]}>
                  <Skeleton height="25px" />
                </td>
                <td className={style["td-time"]}>
                  <Skeleton height="25px" />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export const TableArticleListings = memo(_TableArticleListings)
