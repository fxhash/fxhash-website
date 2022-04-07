import * as Yup from "yup"
import { EReserveMethod } from "../../types/entities/Reserve"

export const YupReserves = Yup.array().of(
  Yup.object({
    amount: Yup.number()
      .positive("At least 1"),
    data: Yup.array()
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
      })
  })
).test(
  "lowerEqualEditions",
  "Sum of reserve amounts must be <= nb editions",
  (value, context) => {
    const eds = context.parent.editions
    const sum: any = value?.reduce((a, b) => a + b.amount!, 0)
    return sum <= eds
  }
)