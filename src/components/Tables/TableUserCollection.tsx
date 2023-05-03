import React, { memo, useCallback } from "react"
import style from "./TableUser.module.scss"
import { UserBadge } from "../User/UserBadge"
import { ObjktImageAndName } from "../Objkt/ObjktImageAndName"
import Skeleton from "../Skeleton"
import cs from "classnames"
import { Objkt } from "../../types/entities/Objkt"
import { DisplayTezos } from "../Display/DisplayTezos"
import { Checkbox } from "../Input/Checkbox"
import { UserCollectionOwnerActions } from "../TableActions/UserCollectionOwnerActions"
import { InputTextUnit } from "../Input/InputTextUnit"
import { IconTezos } from "../Icons/IconTezos"

interface TableUserCollectionProps {
  objkts: Objkt[]
  isOwner: boolean
  loading?: boolean
  onSelectRow: (objkt: Objkt) => void
  onChangeRow: (objktId: string, rowKey: string, value: any) => void
  onSelectAll: () => void
  selectedObjkts: Record<string, any>
}
const _TableUserCollection = ({
  objkts,
  loading,
  isOwner,
  onChangeRow,
  onSelectRow,
  onSelectAll,
  selectedObjkts = {},
}: TableUserCollectionProps) => {
  const handleClickCheckbox = useCallback(
    (objkt) => () => {
      onSelectRow(objkt)
    },
    [onSelectRow]
  )
  const handleChangeRowPrice = useCallback(
    (objktId, rowKey) => (e: any) => {
      onChangeRow(objktId, rowKey, e.target.value * 1000000)
    },
    [onChangeRow]
  )
  const isAllSelected =
    objkts.length > 0 && objkts.length === Object.keys(selectedObjkts).length
  return (
    <>
      <table className={cs(style.table, style.non_sticky, style.no_th_padding)}>
        <thead>
          <tr>
            {isOwner && (
              <th className={style["th-select"]}>
                <Checkbox
                  value={isAllSelected}
                  onChange={onSelectAll}
                  paddingLeft={false}
                  className={style.checkbox}
                />
              </th>
            )}
            <th className={style["th-gentk"]}>Gentk</th>
            <th className={style["th-price"]}>Listed price</th>
            <th className={style["th-user"]}>Author</th>
            {isOwner && (
              <th className={cs(style["th-action"], style["th-right"])}>
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {loading || objkts.length > 0 ? (
            objkts.map((objkt) => {
              const isSelected = !!selectedObjkts[objkt.id]
              const priceValue =
                (selectedObjkts[objkt.id]?.activeListing?.price || 0) / 1000000
              return (
                <tr key={objkt.id}>
                  {isOwner && (
                    <td className={style["td-center"]}>
                      <Checkbox
                        value={isSelected}
                        onChange={handleClickCheckbox(objkt)}
                        paddingLeft={false}
                        className={style.checkbox}
                      />
                    </td>
                  )}
                  <td
                    className={cs(style["td-gentk"], style.td_mobile_fullwidth)}
                  >
                    <div className={cs(style.link_wrapper)}>
                      <ObjktImageAndName objkt={objkt} />
                    </div>
                  </td>
                  <td
                    data-label="Listed Price"
                    className={cs(style["td-price"])}
                  >
                    {isSelected ? (
                      <InputTextUnit
                        name="price"
                        type="number"
                        value={priceValue}
                        min={0}
                        step="any"
                        onChange={handleChangeRowPrice(
                          objkt.id,
                          "activeListing.price"
                        )}
                        classNameContainer={style.input}
                        sizeX="small"
                        unit={<IconTezos size="regular" />}
                        positionUnit="inside-left"
                        id="price"
                      />
                    ) : objkt.activeListing?.price ? (
                      <DisplayTezos
                        formatBig={false}
                        mutez={objkt.activeListing.price}
                        tezosSize="regular"
                        className={style.price}
                      />
                    ) : (
                      <>/</>
                    )}
                  </td>
                  <td data-label="Author">
                    <UserBadge
                      hasLink
                      user={objkt.issuer.author}
                      size="small"
                      displayAvatar={true}
                    />
                  </td>
                  {isOwner && (
                    <td className={style["td-right"]}>
                      <UserCollectionOwnerActions objkt={objkt} />
                    </td>
                  )}
                </tr>
              )
            })
          ) : (
            <tr>
              <td
                className={cs(style.empty, style.td_mobile_fullwidth)}
                colSpan={5}
              >
                No gentks found
              </td>
            </tr>
          )}
          {loading &&
            [...Array(29)].map((_, idx) => (
              <tr key={idx}>
                {isOwner && (
                  <td className={style["td-center"]}>
                    <Skeleton height="26px" width="26px" />
                  </td>
                )}
                <td className={style["td-gentk"]}>
                  <div className={style["skeleton-wrapper"]}>
                    <Skeleton
                      className={style["skeleton-thumbnail"]}
                      height="50px"
                      width="50px"
                    />
                    <Skeleton height="25px" width="100%" />
                  </div>
                </td>
                <td data-label="Listed Price" className={style["td-user"]}>
                  <Skeleton height="25px" />
                </td>
                <td data-label="Author" className={style["td-user"]}>
                  <Skeleton height="25px" />
                </td>
                {isOwner && (
                  <td data-label="Author" className={style["td-right"]}>
                    <Skeleton height="50px" width="50px" />
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </>
  )
}

export const TableUserCollection = memo(_TableUserCollection)
