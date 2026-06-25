import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicPaths = ["/", "/login", "/register"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = publicPaths.some((path) => pathname === path)

  if (isPublic) return NextResponse.next()

  const token =
    request.cookies.get("firebase-token")?.value ??
    request.cookies.get("__session")?.value

  if (!token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
}