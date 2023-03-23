import { addDays, isAfter } from "date-fns"

type CursorIdentifier = "alert-cursor" | "offer-cursor"

const setCursor = (userId: string, identifier: CursorIdentifier) => {
  // read cursors from local storage
  const fromStorage = localStorage.getItem(identifier)
  // if no cursors, create a new object
  const userCursors = fromStorage ? JSON.parse(fromStorage) : {}
  // set cursor for current user
  userCursors[userId] = new Date().toISOString()
  // save to local storage
  localStorage.setItem(identifier, JSON.stringify(userCursors))
}

const readCursor = (userId: string, identifier: CursorIdentifier) => {
  // read alert cursors from local storage
  const fromStorage = localStorage.getItem(identifier)
  // if no cursors, return true
  if (!fromStorage) return null
  // get cursor for current user
  return JSON.parse(fromStorage)[userId]
  // alert if cursor is older than 24 hours
}

const shouldSendDailyAlert = (userId: string) => {
  const cursor = readCursor(userId, "alert-cursor")
  // if no cursor, return true
  if (!cursor) return true
  // alert if cursor is older than 24 hours
  return isAfter(new Date(), addDays(new Date(cursor), 1))
}

export { setCursor, readCursor, shouldSendDailyAlert }
