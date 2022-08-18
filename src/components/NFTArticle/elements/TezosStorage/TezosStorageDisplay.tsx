import React, { useMemo, FunctionComponent } from 'react'
import { ITezosStoragePointer } from '../../../../types/TezosStorage';
import style from "./TezosStorageDisplay.module.scss"
import cs from "classnames"
import { TezosStorageFactory } from './TezosStorageFactory'

type TStorageBlock = "project" | "gentk" | "unknown"

export interface TezosStorageProps extends ITezosStoragePointer {
}

export function TezosStorageDisplay({
  contract,
  path,
  storage_type,
  spec,
  data_spec,
  value_path,
}: TezosStorageProps) {
  // we use the factory to instanciate the rendering component
  const TezosRenderer = useMemo<FunctionComponent>(() => {
    const pointer: ITezosStoragePointer = {
      contract,
      path,
    }
    const Comp = TezosStorageFactory(pointer)
    const props = Comp.getPropsFromPointer(pointer)
    /* eslint-disable react/display-name */
    return () => (
      <Comp {...props}/>
    )
  }, [contract, path])

  return (
    <div className={cs(style.root, "tezos_storage")}>
      <TezosRenderer/>
    </div>
  )
}
