import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { authenticateAdmin } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.ip || "unknown"

    const result = await authenticateAdmin(email || "admin@kyctrust.com", password, ip)

    if (!result.success || !result.token || !result.user) {
      return NextResponse.json(
        { error: result.error || "بيانات تسجيل الدخول غير صحيحة" },
        { status: 401 }
      )
    }

    const res = NextResponse.json({ ok: true })

    res.cookies.set("admin_token", result.token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 24h
    })

    return res
  } catch (error) {
    return NextResponse.json({ error: "خطأ غير متوقع" }, { status: 500 })
  }
}
