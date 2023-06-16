/**
 * Event-related service
 * (Live Minting Events)
 */

interface IMintPassPayload {
  event: string
  token: string
  project: number
  address: string
}

export async function apiEventsSignPayload(payload: IMintPassPayload) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_EVENTS_ROOT!}/sign-payload`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
  if (response.status === 200) {
    return await response.json()
  }
  throw new Error("Error when signing the mint pass.")
}
