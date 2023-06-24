import { EventMedia } from "./EventMedia"
import { User } from "./User"

export enum EventStatus {
  PUBLISHED = "PUBLISHED",
  DRAFT = "DRAFT",
  HIDDEN = "HIDDEN",
}

export enum EventAvailability {
  ONLINE = "ONLINE",
  IRL = "IRL",
}

export interface LiveMintingEvent {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  startsAt: string
  endsAt: string
  projectIds: number[]
  onboarding?: EventOnboarding
  location?: string
  imageUrl?: string
  availabilities: EventAvailability[]
  status: EventStatus
  freeLiveMinting: boolean
  thumbnailMedia?: EventMedia | null
  headerMedia?: EventMedia | null
}

export type LiveMintingEventWithArtists = LiveMintingEvent & { artists: User[] }

export interface DashboardFeatured {
  event: LiveMintingEvent | null
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

export interface OnboardingComponent {
  id: number
  description: string
  content: string
}

export interface EventOnboardingOnComponent {
  component: OnboardingComponent
  index: number
}

export interface EventOnboarding {
  id: number
  enabled: boolean
  description: string
  components: EventOnboardingOnComponent[]
}
