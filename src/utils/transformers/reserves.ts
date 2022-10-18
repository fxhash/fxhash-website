import { EReserveMethod, IReserve } from "../../types/entities/Reserve";

/**
 * Turns a Reserve in the input form into a reserve in the correct format
 */
export function transformReserveInputToGeneric(
  input: IReserve<string>[]
): IReserve<number>[] {
  return input.map(reserve => {
    let data: any
    switch (reserve.method) {
      case EReserveMethod.WHITELIST: {
        data = {}
        for (const sh of reserve.data) {
          data[sh.address] = parseInt(sh.pct)
        }
        break
      }
      case EReserveMethod.MINT_PASS: {
        data = reserve.data
        break
      }
    }
    return {
      amount: reserve.amount as any,
      data: data!,
      method: reserve.method,
    }
  })
}

/**
 * Turns a Generic Reserve into an input-ready format
 */
export function transformReserveGenericToInput(
  input: IReserve<number>[]
): IReserve<string>[] {
  return input.map(reserve => {
    let data: any
    if (reserve.method === EReserveMethod.WHITELIST) {
      data = []
      for (const address in reserve.data) {
        data.push({
          address: address,
          pct: reserve.data[address],
        })
      }
    }
    else if (reserve.method === EReserveMethod.MINT_PASS) {
      data = reserve.data
    }
    return {
      amount: reserve.amount as any,
      data: data!,
      method: reserve.method,
    }
  })
}