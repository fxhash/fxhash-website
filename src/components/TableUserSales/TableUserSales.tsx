import React, { memo } from 'react';
import style from "./TableUserSales.module.scss";
import { Action } from "../../types/entities/Action";
import { ActionReference } from "../Activity/Action";
import { DisplayTezos } from "../Display/DisplayTezos";
import { UserBadge } from "../User/UserBadge";
import { ObjktImageAndName } from "../Objkt/ObjktImageAndName";
import Skeleton from "../Skeleton";

interface TableUserSalesProps {
  sales: Action[],
  loading?: boolean,
}
const _TableUserSales = ({ sales, loading }: TableUserSalesProps) => {
  // todo infinite scroll
  // todo virtualize table
  return (
    <div className={style.wrapper}>
      <table className={style.table}>
        <thead>
          <tr>
            <th className={style['col-gentk']}>Gentk</th>
            <th className={style['col-user']}>Seller</th>
            <th className={style['col-user']}>Buyer</th>
            <th className={style['col-price']}>Price</th>
            <th className={style['col-time']}>Time</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(sale => (
            <tr key={sale.id}>
              <td>
                {sale.objkt &&
                  <ObjktImageAndName
                    objkt={sale.objkt}
                    imagePriority
                  />
                }
              </td>
              <td>
                {sale.issuer ?
                  <UserBadge
                    hasLink={true}
                    user={sale.issuer}
                    size="small"
                  /> : <span>Unknown</span>
                }
              </td>
              <td>
                {sale.target ?
                  <UserBadge
                    hasLink={true}
                    user={sale.target}
                    size="small"
                  /> : <span>Unknown</span>
                }
              </td>
              <td>
                <DisplayTezos
                  className={style.price}
                  formatBig={false}
                  mutez={sale.numericValue}
                  tezosSize="regular"
                />
              </td>
              <td>
                <ActionReference action={sale} />
              </td>
            </tr>
          ))}
          {loading && (
            [...Array(20)].map((_, idx) => (
              <tr key={idx}>
                <td>
                  <div className={style['skeleton-wrapper']}>
                    <Skeleton className={style['skeleton-thumbnail']} height="40px" width="40px"/>
                    <Skeleton height="25px" width="100%"/>
                  </div>
                </td>
                <td><Skeleton height="25px"/></td>
                <td><Skeleton height="25px"/></td>
                <td><Skeleton height="25px"/></td>
                <td><Skeleton height="25px"/></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export const TableUserSales = memo(_TableUserSales);
