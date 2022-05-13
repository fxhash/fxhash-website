import React, { memo, useCallback, useState } from 'react';
import style from "./TableUserSales.module.scss";
import { Action } from "../../types/entities/Action";
import { DisplayTezos } from "../Display/DisplayTezos";
import { ObjktImageAndName } from "../Objkt/ObjktImageAndName";
import Skeleton from "../Skeleton";
import cs from "classnames";
import { Button } from "../Button";

interface TableUserSalesMobileProps {
  sales: Action[],
  loading?: boolean,
}
const _TableUserSalesMobile = ({ sales, loading }: TableUserSalesMobileProps) => {
  const [hideTable, setHideTable] = useState<boolean>(false);
  const handleToggleTableVisibility = useCallback(() => setHideTable(state => !state), []);
  return (
    <>
      <div className={style['container-button']}>
        <Button color="black" size="very-small" onClick={handleToggleTableVisibility}>
          {hideTable ? 'Show' : 'Hide'}
        </Button>
      </div>
      <div className={cs(style.wrapper, {
        [style.hide]: hideTable
      })}>
        <table className={style.table}>
          <thead>
          <tr>
            <th className={style['th-gentk']}>Gentk</th>
            <th className={style['th-price']}>Price</th>
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
            </tr>
          )) :
            <tr>
              <td className={style.empty} colSpan={2}>
                No sales found
              </td>
            </tr>
          }
          {loading && (
            [...Array(20)].map((_, idx) => (
              <tr key={idx}>
                <td className={style['td-gentk']}>
                  <div className={style['skeleton-wrapper']}>
                    <Skeleton className={style['skeleton-thumbnail']} height="40px" width="40px"/>
                    <Skeleton height="25px" width="100%"/>
                  </div>
                </td>
                <td className={style['td-price']}><Skeleton height="25px"/></td>
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export const TableUserSalesMobile = memo(_TableUserSalesMobile);
