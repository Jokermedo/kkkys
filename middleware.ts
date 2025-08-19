import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getAdminFromRequest } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const { pathname } = request.nextUrl

  const securityHeaders = {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-XSS-Protection": "1; mode=block",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()",
    "X-DNS-Prefetch-Control": "on",
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.whatsapp.com https://wa.me; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
  }

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
  }

  // Consolidate admin entry: redirect /admin -> /dashboard (keeps admin experience under one tree)
  if (pathname === "/admin") {
    const url = new URL(request.url)
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    // Allow login page and auth API routes
    if (pathname === "/admin/login" || pathname.startsWith("/api/auth/") || pathname.startsWith("/api/admin/")) {
      response.headers.set("X-Robots-Tag", "noindex, nofollow")
      return response
    }

    // Check authentication for other admin routes
    try {
      const user = await getAdminFromRequest(request)

      if (!user) {
        const loginUrl = new URL("/admin/login", request.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
      }

      const protectedRoutes: Record<string, string[]> = {
        "/admin/users": ["users", "all"],
        "/admin/settings": ["settings", "all"],
        "/admin/database": ["database", "all"],
        "/admin/security": ["security", "all"],
        "/admin/analytics": ["analytics", "all"],
        "/admin/monitoring": ["monitoring", "all"],
        "/dashboard/users": ["users", "all"],
        "/dashboard/settings": ["settings", "all"],
        "/dashboard/settings/db": ["database", "all"],
        "/dashboard/security": ["security", "all"],
        "/dashboard/analytics": ["analytics", "all"],
        "/dashboard/monitoring": ["monitoring", "all"],
      }

      const requiredPermissions = protectedRoutes[pathname]
      if (requiredPermissions && !requiredPermissions.some((perm) => user.permissions.includes(perm))) {
        return NextResponse.json({ error: "ليس لديك صلاحية للوصول إلى هذه الصفحة" }, { status: 403 })
      }

      response.headers.set("X-Robots-Tag", "noindex, nofollow")
    } catch (error) {
      console.error("Middleware auth error:", error)
      const loginUrl = new URL("/admin/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  if (pathname.startsWith("/_next/static/") || pathname.startsWith("/images/")) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable")
    response.headers.set("Vary", "Accept-Encoding")
  }

  if (pathname === "/" || pathname === "/ar" || pathname === "/en") {
    response.headers.set(
      "Link",
      [
        "<https://fonts.googleapis.com>; rel=preconnect",
        "<https://fonts.gstatic.com>; rel=preconnect; crossorigin",
        "</fonts/inter-var.woff2>; rel=preload; as=font; type=font/woff2; crossorigin",
        "</fonts/cairo-var.woff2>; rel=preload; as=font; type=font/woff2; crossorigin",
      ].join(", "),
    )
  }

  if (pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "no-store, must-revalidate")
    response.headers.set("X-Robots-Tag", "noindex, nofollow")
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)", "/api/(.*)"],
}
