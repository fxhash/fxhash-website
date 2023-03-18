import { IPricingDutchAuction } from "types/entities/Pricing"

export function generateInitialPricingDutchAuction(): IPricingDutchAuction<string> {
  return {
    decrementDuration: "10",
    levels: ["50", "30", "20", "10", "5"],
  }
}
