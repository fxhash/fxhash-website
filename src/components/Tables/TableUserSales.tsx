import React, { memo, useContext, useRef } from "react"
import style from "./TableUser.module.scss"
import text from "../../styles/Text.module.css"
import { Action } from "../../types/entities/Action"
import { ActionReference } from "../Activity/Action"
import { DisplayTezos } from "../Display/DisplayTezos"
import { UserBadge } from "../User/UserBadge"
import { ObjktImageAndName } from "../Objkt/ObjktImageAndName"
import Skeleton from "../Skeleton"
import cs from "classnames"
import useHasScrolledToBottom from "../../hooks/useHasScrolledToBottom"
import { UserContext } from "../../containers/UserProvider"
import { getActionBuyer, getActionSeller } from "../../utils/entities/actions"

interface TableUserSalesProps {
  sales: Action[]
  loading?: boolean
  onScrollToBottom?: () => void
}
const _TableUserSales = ({
  sales,
  loading,
  onScrollToBottom,
}: TableUserSalesProps) => {
  const { user: userInCtx } = useContext(UserContext)
  const refWrapper = useRef<HTMLDivElement>(null)
  useHasScrolledToBottom(refWrapper, {
    onScrollToBottom,
    offsetBottom: 100,
  })
  return (
    <>
      <div ref={refWrapper} className={cs(style.wrapper)}>
        <table className={cs(style.table)}>
          <thead>
            <tr>
              <th className={style["th-gentk"]}>Gentk</th>
              <th className={style["th-price"]}>Price</th>
              <th className={style["th-user"]}>Buyer</th>
              <th className={style["th-user"]}>Seller</th>
              <th className={style["th-time"]}>Time</th>
            </tr>
          </thead>
          <tbody>
            {loading || sales.length > 0 ? (
              sales.map((sale) => (
                <>
                  <tr key={sale.id}>
                    <td
                      className={cs(
                        style["td-gentk"],
                        style.td_mobile_fullwidth
                      )}
                    >
                      {sale.objkt && (
                        <div className={cs(style.link_wrapper)}>
                          <ObjktImageAndName objkt={sale.objkt} label="" />
                        </div>
                      )}
                    </td>
                    <td data-label="Price" className={style["td-price"]}>
                      <DisplayTezos
                        className={style.price}
                        formatBig={false}
                        mutez={sale.numericValue}
                        tezosSize="regular"
                      />
                    </td>
                    <td data-label="Buyer" className={style["td-user"]}>
                      <UserBadge
                        hasLink
                        user={getActionBuyer(sale)}
                        size="small"
                        displayAvatar={false}
                        className={cs({
                          [text.bold]:
                            userInCtx?.id === getActionBuyer(sale).id,
                        })}
                      />
                    </td>
                    <td data-label="Seller" className={style["td-user"]}>
                      <UserBadge
                        hasLink
                        user={getActionSeller(sale)}
                        size="small"
                        displayAvatar={false}
                        className={cs({
                          [text.bold]:
                            userInCtx?.id === getActionSeller(sale).id,
                        })}
                      />
                    </td>
                    <td data-label="Time" className={style["td-time"]}>
                      <ActionReference className={style.date} action={sale} />
                    </td>
                  </tr>
                </>
              ))
            ) : (
              <tr>
                <td
                  className={cs(style.empty, style.td_mobile_fullwidth)}
                  colSpan={5}
                >
                  No sales found
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
                  <td data-label="Price" className={style["td-user"]}>
                    <Skeleton height="25px" />
                  </td>
                  <td data-label="Buyer" className={style["td-user"]}>
                    <Skeleton height="25px" />
                  </td>
                  <td data-label="Seller" className={style["td-user"]}>
                    <Skeleton height="25px" />
                  </td>
                  <td data-label="Time" className={style["td-time"]}>
                    <Skeleton height="25px" />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export const TableUserSales = memo(_TableUserSales)
