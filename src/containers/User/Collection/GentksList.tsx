import React, { memo, useCallback, useMemo, useState } from "react"
import { Objkt } from "../../../types/entities/Objkt"
import { TableUserCollection } from "../../../components/Tables/TableUserCollection"
import style from "./GentksList.module.scss"
import { GentksListBatchActions } from "./GentksListBatchActions"
import { setNestedProp } from "../../../utils/strings"

interface GentksListProps {
  objkts: Objkt[]
  editable: boolean
  loading: boolean
  hasMoreObjkts: boolean
}

const _GentksList = ({
  objkts,
  editable,
  loading,
  hasMoreObjkts,
}: GentksListProps) => {
  const [selectedObjkts, setSelectedObjkts] = useState<Record<string, Objkt>>(
    {}
  )
  const handleSelectRow = useCallback((objkt) => {
    setSelectedObjkts((oldObjkts) => {
      const newObjks = { ...oldObjkts }
      if (newObjks[objkt.id]) {
        delete newObjks[objkt.id]
      } else {
        newObjks[objkt.id] = objkt
      }
      return newObjks
    })
  }, [])
  const handleChangeRow = useCallback((objktId, rowKey, value) => {
    setSelectedObjkts((oldObjkts) => {
      const newObjks = { ...oldObjkts }
      const foundObjkt = newObjks[objktId]
      if (foundObjkt) {
        newObjks[objktId] = setNestedProp(
          { ...foundObjkt },
          rowKey.split("."),
          value
        )
      }
      return newObjks
    })
  }, [])
  const handleSelectAll = useCallback(() => {
    setSelectedObjkts((oldObjkts) => {
      const hasAllSelected = Object.keys(oldObjkts).length === objkts.length
      return hasAllSelected
        ? {}
        : objkts.reduce((acc, objkt) => {
            acc[objkt.id] = objkt
            return acc
          }, {} as Record<string, Objkt>)
    })
  }, [objkts])
  const selectedObjktsArray = useMemo(
    () => Object.values(selectedObjkts),
    [selectedObjkts]
  )
  const totalSelected = selectedObjktsArray.length
  return (
    <div>
      <TableUserCollection
        objkts={objkts}
        isOwner={editable}
        loading={loading}
        selectedObjkts={selectedObjkts}
        onSelectRow={handleSelectRow}
        onSelectAll={handleSelectAll}
        onChangeRow={handleChangeRow}
      />
      {totalSelected > 0 && (
        <div className={style.batch_actions}>
          <div className={style.selected}>
            {totalSelected}/{objkts.length}
            {hasMoreObjkts ? "+" : ""} selected
          </div>
          <div>
            <GentksListBatchActions objkts={selectedObjktsArray} />
          </div>
        </div>
      )}
    </div>
  )
}

export const GentksList = memo(_GentksList)
