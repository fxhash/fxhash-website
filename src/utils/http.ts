import { NextApiResponse } from "next"
import cookie, { CookieSerializeOptions } from "cookie"

export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: string,
  options: CookieSerializeOptions
) => {
  if (options.maxAge) {
    options.expires = new Date(Date.now() + options.maxAge)
    options.maxAge /= 1000
  }

  res.setHeader("Set-Cookie", cookie.serialize(name, value, options))
}
