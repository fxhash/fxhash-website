export type TzktBigmapAction = "add_key" | "update_key" | "remove_key"

export interface TzktBigmapUpdate<T> {
  id: number,
  level: number,
  timestamp: string,
  bigmap: number,
  contract: {
    alias: string,
    address: string,
  },
  path: string,
  action: TzktBigmapAction,
  content: T
}

export interface TzktBigmapOfferContent {
  hash: string,
  key: string,
  value: {
    price: string,
    issuer: string,
    creator: string,
    objkt_id: string,
    royalties: string,
    objkt_amount: string
  }
}

export interface TzktOrigination {
  id: number
  level: number
  timestamp: string
  originatedContract: {
    kind: string
    alias: string
    address: string
    typeHash: number
    codeHash: number
  }
}

export interface TzktBigmapDiff<K = any, V = any> {
  path: string
  action: TzktBigmapAction
  content: {
    hash: string
    key: K
    value: V
  }
}

export interface TzktOperation {
  id: number
  level: number
  timestamp: string
  sender: {
    address: string
  }
  amount: number
  parameter: {
    entrypoint: string
    value: any
  }
  diffs: TzktBigmapDiff[]
  target: {
    alias: string
    address: string
  }
  initiator: {
    address: string
  }
  hash: string
}