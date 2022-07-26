import React, { memo, forwardRef, PropsWithChildren } from 'react';
import { NFTArticleElementComponent } from "../../../types/Article";
import { ITezosStoragePointer, OptionalTezosStoragePointerKeys } from '../../../types/TezosStorage';
import style from "./TezosStorage.module.scss"

export interface TezosStorageProps extends ITezosStoragePointer {
}

export function TezosStorage({ 
  contract,
  path,
  storage_type,
  spec,
  data_spec,
  value_path,
}: TezosStorageProps) {
  // the contract defines which type of tezos storage we are displaying
  return (
    <div className={style.bg}>
      <div contentEditable={false}>{`\{`}</div>
      <div className={style.tab}>
        <div contentEditable={false}><span className={style.property}>{'"contract"'}</span><span>{`: "${contract}"`}</span></div>
        <div contentEditable={false}><span className={style.property}>{'"path"'}</span><span>{`: "${path}"`}</span></div>
        <div contentEditable={false}><span className={style.property}>{'"storage_type"'}</span><span>{`: "${storage_type}"`}</span></div>
        <div contentEditable={false}><span className={style.property}>{'"spec"'}</span><span>{`: "${spec}"`}</span></div>
        <div contentEditable={false}><span className={style.property}>{'"data_spec"'}</span><span>{`: "${data_spec}"`}</span></div>
        <div contentEditable={false}><span className={style.property}>{'"value_path"'}</span><span>{`: "${value_path}"`}</span></div>
      </div>
      <div contentEditable={false}>{`\}`}</div>
    </div>
  )
}