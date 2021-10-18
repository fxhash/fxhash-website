import { MichelsonMap } from "@taquito/michelson-encoder"

export interface ProfileUpdateCallData {
  metadata: string,
  name: string
}

export interface MintGenerativeCallData {
  amount: number,
  enabled: boolean,
  metadata: {
    "": string
  },
  price: number,
  royalties: number,
  token_name: string
}

export interface MintGenerativeRawCall {
  amount: number,
  enabled: boolean,
  metadata: MichelsonMap<string, string>
  price: number,
  royalties: number,
  token_name: string
}

export interface UpdateGenerativeCallData {
  enabled: boolean,
  price: number,
  royalties: number,
  issuer_id: number
}