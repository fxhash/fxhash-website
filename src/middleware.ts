import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "./utils/protection"

const isPasswordProtected = async (request: NextRequest) => {
  const isCookieValid = async () => {
    const encryptedPassword = request.cookies.get("password-protection")
    if (!encryptedPassword) return false
    try {
      await verify(encryptedPassword, process.env.PASSWORD_PROTECTION!)
      return true
    } catch (e: any) {
      return false
    }
  }
  return (
    request.nextUrl.pathname !== "/password-protection" &&
    !(await isCookieValid())
  )
}

const PUBLIC_FILE = /\.(.*)$/
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (PUBLIC_FILE.test(pathname)) {
    return NextResponse.next()
  }
  if (process.env.PASSWORD_PROTECTION && (await isPasswordProtected(request))) {
    return NextResponse.redirect(new URL("/password-protection", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: "/((?!api|_next/static|favicon.ico).*)",
}
