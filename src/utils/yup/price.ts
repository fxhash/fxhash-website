import { addHours, isAfter } from "date-fns"
import * as Yup from "yup"

// object to validate if a price is valid
export const YupPrice = Yup.number()
  .typeError("Valid number plz")
  .required("Required")
  .positive("Must be positive")

// validates a PricingFixed input object
export const YupPricingFixed = Yup.object({
  price: YupPrice,
  opensAt: Yup.mixed()
    .test(
      "min",
      "Must be after now",
      (date) => {
        if (!date) return true
        return isAfter(date, new Date())
      }
    )
})

// validates a PricingDutchAuction
export const YupPricingDutchAuction = Yup.object({
  decrementDuration: Yup.number()
    .typeError("Valid number plz")
    .required("Required")
    .integer("Integers only")
    .min(5, "Min 5 minutes"),
  opensAt: Yup.date()
    .typeError("Invalid date")
    .required("Required")
    .min(addHours(new Date(), 1), "At least in 1 hour"),
  levels: Yup.array()
    .of(YupPrice)
    .test(
      "decrement",
      "Prices must decrement",
      (arr) => {
        if (!arr) return true
        for (let i = 1; i < arr.length; i++) {
          if ((typeof arr[i] === "undefined") 
          || (typeof arr[i-1] === "undefined")) {
            continue
          }
          console.log(arr[i]! >= arr[i-1]!)
          if (arr[i]! >= arr[i-1]!) {
            return false
          }
        }
        return true
      }
    )
})