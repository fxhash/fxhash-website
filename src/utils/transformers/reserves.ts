import { EReserveMethod, IReserve } from "../../types/entities/Reserve";

/**
 * Turns a Reserve in the input form into a reserve in the correct format
 */
export function transformReserveInputToGeneric(
  input: IReserve<string>[]
): IReserve<number>[] {
  return input.map(reserve => {
    let data: any
    if (reserve.method === EReserveMethod.WHITELIST) {
      data = {}
      for (const sh of reserve.data) {
        data[sh.address] = parseInt(sh.pct)
      }
    }
    return {
      amount: reserve.amount as any,
      data: data!,
      method: reserve.method,
    }
  })
}