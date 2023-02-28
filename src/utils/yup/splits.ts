import * as Yup from "yup"

// validates splits (checks for sum 1000 etc)
export const YupSplits = Yup.array()
  .of(
    Yup.object({
      pct: Yup.number()
        .typeError("Invalid number")
        .required("Required")
        .integer("Integer only")
        .min(1, "At least 1")
        .max(1000, "Max 1000"),
    })
  )
  .min(1, "At least 1 required")
  .test("sum1000", "Shares must sum to 1000", (splits) => {
    if (!splits) return true
    return (
      splits.reduce(
        // @ts-ignore
        (prev, sp) => prev + parseInt(sp.pct as any),
        0
      ) === 1000
    )
  })
