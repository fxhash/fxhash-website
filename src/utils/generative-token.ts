import { GenerativeToken } from "../types/entities/GenerativeToken"

export function getGenerativeTokenUrl(generative: GenerativeToken): string {
  return generative.slug ? `/generative/slug/${generative.slug}` : `/generative/${generative.id}`
}

export function getGenerativeTokenMarketplaceUrl(generative: GenerativeToken): string {
  return `/marketplace/generative/${generative.id}`
}