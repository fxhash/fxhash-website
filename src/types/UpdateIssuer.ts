import { GenTokDistributionForm } from "./Mint"

export type UpdateIssuerForm<N = string> = Omit<
  Omit<Omit<GenTokDistributionForm<N>, "pricing">, "reserves">,
  "gracingPeriod"
>
