import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // فقط مسیرهای ادمین رو چک کن
  if (pathname.startsWith("/admin")) {
    // کوکی رو چک کن
    const userCookie = req.cookies.get("user")

    if (!userCookie) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    try {
      const user = JSON.parse(userCookie.value)
      if (user.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url))
      }
    } catch {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}