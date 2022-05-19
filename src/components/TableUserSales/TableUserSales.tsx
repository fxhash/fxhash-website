import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import style from "./TableUserSales.module.scss";
import { Action } from "../../types/entities/Action";
import { ActionReference } from "../Activity/Action";
import { DisplayTezos } from "../Display/DisplayTezos";
import { UserBadge } from "../User/UserBadge";
import { ObjktImageAndName } from "../Objkt/ObjktImageAndName";
import Skeleton from "../Skeleton";
import { User } from '../../types/entities/User';
import { Button } from "../Button";
import cs from "classnames";
import useHasScrolledToBottom from "../../hooks/useHasScrolledToBottom";

interface TableUserSalesDesktopProps {
  user: User,
  sales: Action[],
  loading?: boolean,
  onScrollToBottom?: () => void,
}
const _TableUserSalesDesktop = ({ user, sales, loading, onScrollToBottom }: TableUserSalesDesktopProps) => {
  const refWrapper = useRef<HTMLDivElement>(null);
  const [hideTable, setHideTable] = useState<boolean>(false);
  useHasScrolledToBottom(refWrapper, {
    onScrollToBottom,
    offsetBottom: 100
  });
  const handleToggleTableVisibility = useCallback(() => setHideTable(state => !state), []);
  return (
    <>
      <div className={style['container-button']}>
        <Button color="black" size="very-small" onClick={handleToggleTableVisibility}>
          {hideTable ? 'Show' : 'Hide'}
        </Button>
      </div>
      <div ref={refWrapper} className={cs(style.wrapper, {
        [style.hide]: hideTable
      })}>
        <table className={style.table}>
          <thead>
          <tr>
            <th className={style['th-gentk']}>Gentk</th>
            <th className={style['th-price']}>Price</th>
            <th className={style['th-user']}>Seller</th>
            <th className={style['th-user']}>Buyer</th>
            <th className={style['th-time']}>Time</th>
          </tr>
          </thead>
          <tbody>
          {(loading || sales.length > 0) ? sales.map(sale => (
              <tr key={sale.id}>
                <td className={style['td-gentk']}>
                  {sale.objkt &&
                    <ObjktImageAndName
                      objkt={sale.objkt}
                      imagePriority
                    />
                  }
                </td>
                <td className={style['td-price']}>
                  <DisplayTezos
                    className={style.price}
                    formatBig={false}
                    mutez={sale.numericValue}
                    tezosSize="regular"
                  />
                </td>
                <td className={style['td-user']}>
                  {sale.target ? (
                    user.id === sale.target.id
                      ? <strong>you</strong>
                      : (
                        <UserBadge
                          hasLink
                          user={sale.target}
                          size="small"
                          displayAvatar={false}
                        />
                      )
                  ): <span>Unknown</span>}
                </td>
                <td className={style['td-user']}>
                  {sale.issuer ? (
                    user.id === sale.issuer.id
                      ? <strong>you</strong>
                      : (
                        <UserBadge
                          hasLink
                          user={sale.issuer}
                          size="small"
                          displayAvatar={false}
                        />
                      )
                  ): <span>Unknown</span>}
                </td>
                <td className={style['td-time']}>
                  <ActionReference action={sale} />
                </td>
              </tr>
            )) :
            <tr>
              <td className={style.empty} colSpan={5}>
                No sales found
              </td>
            </tr>
          }
          {loading && (
            [...Array(29)].map((_, idx) => (
              <tr key={idx}>
                <td className={style['td-gentk']}>
                  <div className={style['skeleton-wrapper']}>
                    <Skeleton className={style['skeleton-thumbnail']} height="40px" width="40px"/>
                    <Skeleton height="25px" width="100%"/>
                  </div>
                </td>
                <td className={style['td-user']}><Skeleton height="25px"/></td>
                <td className={style['td-user']}><Skeleton height="25px"/></td>
                <td className={style['td-price']}><Skeleton height="25px"/></td>
                <td className={style['td-time']}><Skeleton height="25px"/></td>
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>
   </>
  );
}

export const TableUserSales = memo(_TableUserSalesDesktop);
