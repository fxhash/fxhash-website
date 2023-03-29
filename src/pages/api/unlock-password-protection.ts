import { NextApiRequest, NextApiResponse } from "next"
import { setCookie } from "../../utils/http"
import crypto from "crypto"
import { sign } from "../../utils/protection"

export function compare(a: any, b: any) {
  const strA = String(a)
  const strB = String(b)
  const aLen = Buffer.byteLength(strA)
  const bLen = Buffer.byteLength(strB)

  // Always use length of a to avoid leaking the length. Even if this is a
  // false positive because one is a prefix of the other, the explicit length
  // check at the end will catch that.
  const bufA = Buffer.allocUnsafe(aLen)
  bufA.write(strA)
  const bufB = Buffer.allocUnsafe(aLen)
  bufB.write(strB)

  return crypto.timingSafeEqual(bufA, bufB) && aLen === bLen
}

const unlockPasswordProtectionHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  res.setHeader("Content-Type", "application/json")
  try {
    if (req.method !== "POST") {
      throw new Error("Invalid method.")
    }

    if (!req?.body?.password) {
      throw new Error("Invalid request.")
    }
    const { password: providedPassword } = req.body

    if (compare(providedPassword, process.env.PASSWORD_PROTECTION)) {
      setCookie(res, "password-protection", await sign({}, providedPassword), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      })
      res.status(200).json({})
      return
    }
    res.status(400).json({ message: "Incorrect password." })
  } catch (err: any) {
    console.log(err)
    res.status(500).json({ message: err.message || "An error has occured." })
  }
}

export default unlockPasswordProtectionHandler
