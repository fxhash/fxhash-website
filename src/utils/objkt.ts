import { Objkt } from "../types/entities/Objkt"

export function getObjktUrl(objkt: Objkt): string {
  return objkt.slug ? `/objkt/slug/${objkt.slug}` : `/objkt/${objkt.id}`
}