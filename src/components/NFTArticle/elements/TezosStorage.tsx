import React, { memo } from 'react';

interface TezosStorageProps {
  address: string
  pKey: string
  type?: string
  metadataSpec?: string
  bigmap?: string
  value?: string
  children: string
}

const TezosStorage = memo(({ address, type, metadataSpec, pKey, children }: TezosStorageProps) => {
  return (
    <div>
      <div contentEditable={false}>
        <div>{address}</div>
        <div>{type}</div>
        <div>{metadataSpec}</div>
	<div>{pKey}</div>
      </div>
      <div>{children}</div>
    </div>
  );
});
TezosStorage.displayName = 'TezosStorage';
TezosStorage.defaultProps = {
  type: 'TZIP-012',
  metadataSpec: 'TZIP-021',
  bigmap: 'token_metadata',
  value: 'token_info'
}
export default TezosStorage;

TezosStorage.getPropsFromNode = (node: Node, properties) => {
  return {
    address: properties.address,
    pKey: properties.key,
    type: properties.type,
    metadataSpec: properties.metadata_spec,
    bigmap: properties.bigmap,
    value: properties.value,
  }
}
