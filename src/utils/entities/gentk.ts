import { Objkt } from "./../../types/entities/Objkt"

/**
 * recent V3 tokens have an ID of "FXN-{id}", so we need to extract the ID
 * part only for these recent tokens
 */
export function getGentkLocalID(token: Objkt): string {
  let id = token.id
  if (id.includes("-")) {
    id = id.split("-")[1]
  }
  return id
}
