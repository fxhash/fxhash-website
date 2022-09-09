import React, { memo } from 'react';
import style from "./TableUser.module.scss";
import text from "../../styles/Text.module.css"
import { UserBadge } from "../User/UserBadge";
import Skeleton from "../Skeleton";
import { Listing } from "../../types/entities/Listing";
import { ArticleListingActions } from "../TableActions/ArticleListingActions";
import { DateDistance } from "../Utils/Date/DateDistance";
import cs from "classnames";
import { Ledger } from "../../types/entities/Ledger";

interface TableArticleListingsProps {
  listings: Listing[],
  ledgers: Ledger[],
  loading?: boolean,
}
const _TableArticleListings = ({
  listings,
  ledgers,
  loading,
}: TableArticleListingsProps) => {
  return (
    <div className={style.wrapper_scrollable_x}>
      <table className={style.table}>
        <thead>
          <tr>
            <th className={style['th-gentk']}>User</th>
            <th className={cs(style['th-editions'], style['th-center'])}>Editions</th>
            <th className={cs(style['th-time'], style['th-center'])}>Time</th>
            <th className={cs(style['th-listing-actions'], style['th-right'])}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(loading || listings.length > 0) ? listings.map(listing => (
            <ArticleListingActions
              key={`${listing.id}-${listing.version}`}
              listing={listing}
            >
              {({ buttons }) => (
                <>
                  <tr>
                    <td className={style['td-gentk']}>
                      <UserBadge
                        hasLink
                        user={listing.issuer}
                        size="small"
                      />
                    </td>
                    <td className={cs(style['td-editions'], style['td-center'])}>
                      <span className={text.bold}>{listing.amount}</span>
                    </td>
                    <td className={cs(style['td-time'], style['td-center'])}>
                      <div className={cs(text.bold)}>
                        <DateDistance
                          timestamptz={listing.createdAt}
                        />
                      </div>
                    </td>
                    <td>
                      <div className={style.article_actions}>
                        {buttons}
                      </div>
                    </td>
                  </tr>
                </>
              )}
            </ArticleListingActions>
          )) :
          <tr>
            <td className={style.empty} colSpan={4}>
              No listings found
            </td>
          </tr>
        }
        <tr className={style.tr_separator}>
          <td colSpan={4} />
        </tr>
        {loading || ledgers.length > 0 && ledgers.map((ledger, idx) => (
          <tr key={ledger.owner?.id || idx}>
            <td className={style['td-gentk']}>
              <UserBadge
                hasLink
                user={ledger.owner}
                size="small"
              />
            </td>
            <td className={cs(style['td-editions'], style['td-center'])}>
              <span className={text.bold}>{ledger.amount}</span>
            </td>
            <td colSpan={2} />
          </tr>
        ))}
        {loading && (
          [...Array(10)].map((_, idx) => (
            <tr key={idx}>
              <td className={style['td-gentk']}>
                <div className={style['skeleton-wrapper']}>
                  <Skeleton className={style['skeleton-thumbnail']} height="40px" width="40px"/>
                  <Skeleton height="25px" width="100%"/>
                </div>
              </td>
              <td className={style['td-user']}><Skeleton height="25px"/></td>
              <td className={style['td-price']}><Skeleton height="25px"/></td>
              <td className={style['td-time']}><Skeleton height="25px"/></td>
            </tr>
          ))
        )}
        </tbody>
      </table>
   </div>
  );
}

export const TableArticleListings = memo(_TableArticleListings);
