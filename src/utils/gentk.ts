import { Objkt } from "../types/entities/Objkt"

export function getGentkUrl(gentk: Objkt): string {
  return gentk.slug ? `/gentk/slug/${gentk.slug}` : `/gentk/${gentk.id}`
}