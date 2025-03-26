import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const publicPaths = [
    "/",
    "/auth/login",
    "/auth/register",
    "/auth/verify-email",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/about",
    "/projects",
    "/projects/[id]",
  ]

  // Check if the path is public
  const isPublicPath = publicPaths.some((publicPath) => {
    if (publicPath.includes("[")) {
      // Handle dynamic routes
      const pathPattern = publicPath.replace(/\[.*?\]/g, "[^/]+")
      const regex = new RegExp(`^${pathPattern}$`)
      return regex.test(path)
    }
    return path === publicPath
  })

  // If it's a public path, allow access
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Check for authentication token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  }) as { kycStatus?: string } | null

  // If not authenticated, redirect to login
  if (!token) {
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  // Check for KYC requirement
  const kycRequiredPaths = ["/dashboard/transactions", "/dashboard/projects", "/vote", "/create"]

  const requiresKYC = kycRequiredPaths.some((kycPath) => path.startsWith(kycPath))

  if (requiresKYC && token.kycStatus !== "approved") {
    return NextResponse.redirect(new URL("/auth/kyc", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

