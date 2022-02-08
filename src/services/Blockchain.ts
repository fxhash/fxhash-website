export const API_BLOCKCHAIN_CONTRACT_STORAGE = (address: string) => `${process.env.NEXT_PUBLIC_TZKT_API}contracts/${address}/storage`

export const API_CYCLES_LIST = `${process.env.NEXT_PUBLIC_TZKT_API}bigmaps/updates?contract=${process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_CYCLES}&path=cycles&action=add_key&limit=500`