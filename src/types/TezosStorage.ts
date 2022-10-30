/**
 * A Tezos Storage Pointer is a list of properties designed to target any
 * content stored in Tezos Smart Contracts. It is primarly designed to get NFT
 * content but can be utilized in other fashions.
 * https://github.com/fxhash/specifications/blob/04fd4c0d5752122324dfc60d8491ee10850c5b93/general/tezos-storage-pointers.md
 */
export interface ITezosStoragePointer {
  // the contract address under which the resource can be found
  contract: string
  // a list of colon-separated values to access the resource in the storage
  // for instance, to get a token metadata in a FA2 contract it would be:
  // "token_metadata:1452"
  // where "token_metadata" is the bigmap key
  // and where "1452" is the key in the bigmap
  path: string
  // the type of the data we fetch, default: "bigmap"
  storage_type?: string
  // the specification of the data we expect to get, default undefined
  data_spec?: string
  // the path to get the actual data from the value we get from the contract
  // storage, default: "token_info:"
  // for instance for the default, split by the colon and we get 2 values:
  // "token_info" and ""
  // these values can be used to access the according properties in the object
  // we get from the storage, resulting in the IPFS uri
  value_path?: string
}

// a list of the optional tezos storage pointer keys
export const OptionalTezosStoragePointerKeys: (keyof ITezosStoragePointer)[] = [
  "storage_type", "data_spec", "value_path"
]