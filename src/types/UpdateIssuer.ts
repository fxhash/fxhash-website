import { GenTokDistributionForm } from "./Mint"

export type UpdateIssuerForm<N = string> = Omit<Omit<
  GenTokDistributionForm<N>, 
  "pricing"
>, "reserves"
>