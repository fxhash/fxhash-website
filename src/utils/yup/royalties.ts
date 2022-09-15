import * as Yup from "yup"

// validates a royalties input
export const YupRoyalties = Yup.number()
  .required("Required")
  .typeError("Valid number plz")
  .min(10, "Min 10%")
  .max(25, "Max 25%")