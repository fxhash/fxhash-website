import { GenTokDistributionForm } from "./Mint"

export type UpdateIssuerForm<N = string> = Omit<
  GenTokDistributionForm<N>, 
  "pricing"
>