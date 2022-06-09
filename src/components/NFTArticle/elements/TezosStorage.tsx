<<<<<<< HEAD
import React, { memo, forwardRef } from 'react';
=======
import React, { memo } from 'react';
import { NFTArticleElementComponent } from "../../../types/Article";
import style from "./TezosStorage.module.scss"
>>>>>>> feat/gfm-extended-parser

export interface TezosStorageProps {
  address: string
  pKey: string
  type?: string
  metadataSpec?: string
  bigmap?: string
  value?: string
  children?: string
}

const TezosStorage: NFTArticleElementComponent<TezosStorageProps> = memo(forwardRef(({ address, pKey, children }: TezosStorageProps, ref) => {
  return (
    <div ref={ref} className={style.bg}>
      <div contentEditable={false}>{`\{`}</div>
      <div className={style.tab}>
        <div contentEditable={false}><span className={style.property}>{'"address"'}</span><span>{`: "${address}"`}</span></div>
        <div contentEditable={false}><span className={style.property}>{'"key"'}</span><span>{`: "${pKey}"`}</span></div>
        <div><span className={style.property}>{'"annotation"'}</span><span>{`: "${children}"`}</span></div>
      </div>
      <div contentEditable={false}>{`\}`}</div>
    </div>
  );
}));

TezosStorage.displayName = 'TezosStorage';
TezosStorage.defaultProps = {
  type: 'TZIP-012',
  metadataSpec: 'TZIP-021',
  bigmap: 'token_metadata',
  value: 'token_info'
}
export default TezosStorage;

TezosStorage.getPropsFromNode = (node, properties) => {
  return {
    address: properties.address,
    pKey: properties.key,
    type: properties.type,
    metadataSpec: properties.metadata_spec,
    bigmap: properties.bigmap,
    value: properties.value,
  }
}
