import * as Yup from "yup"
import { EReserveMethod } from "../../types/entities/Reserve"
import { isContractAddress } from "../tezos"

export const YupReserves = (
  getAmount = (ctx: any): number => ctx.parent.editions
) =>
  Yup.array()
    .of(
      Yup.object({
        amount: Yup.number().positive("At least 1"),
        data: Yup.mixed()
          .when("method", {
            is: EReserveMethod.WHITELIST,
            then: Yup.array()
              .test(
                "minSumAmount",
                "Total of editions must be >= amount",
                (value, context) => {
                  const amount = context.parent.amount
                  const sum = value?.reduce((a, b) => a + parseInt(b.pct), 0)
                  return sum >= amount
                }
              )
              .test(
                "maxEntries",
                "At most 500 different addresses",
                (value, context) => {
                  return (value?.length || 0) < 500
                }
              ),
          })
          .when("method", {
            is: EReserveMethod.MINT_PASS,
            then: Yup.string().test(
              "ktAddress",
              "Invalid contract address",
              (value, context) => {
                return value ? isContractAddress(value) : false
              }
            ),
          }),
      })
    )
    .test(
      "lowerEqualEditions",
      "Sum of reserve amounts must be <= nb editions",
      (value, context) => {
        const eds = getAmount(context)
        const sum: any = value?.reduce((a, b) => a + b.amount!, 0)
        return sum <= eds
      }
    )
