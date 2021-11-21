import { GenerativeToken } from "../types/entities/GenerativeToken"

export function getGenerativeTokenUrl(generative: GenerativeToken): string {
  return generative.slug ? `/generative/slug/${generative.slug}` : `/generative/${generative.id}`
}