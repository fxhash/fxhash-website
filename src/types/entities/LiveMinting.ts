export interface LiveMintingEvent {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  startsAt: string
  endsAt: string
  projectIds: number[]
}

export interface LiveMintingPassGroup {
  address: string
  label: string
  maxMints: number
  maxMintsPerProject: number
  event: LiveMintingEvent
}

export interface LiveMintingPass {
  token: string
  group: LiveMintingPassGroup
  expiresAt: string
}