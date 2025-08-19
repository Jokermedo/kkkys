import { NextResponse } from "next/server"

// Simple keyword-based assistant fallback (no external API keys required)
export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as {
      messages?: { role: "user" | "assistant"; content: string }[]
    }

    const lastUser = [...(messages || [])]
      .reverse()
      .find((m) => m.role === "user")?.content?.toLowerCase() || ""

    let reply = "يسعدني مساعدتك! اسألني عن خدمات التحقق، التسعير، أو كيفية التواصل."

    if (lastUser.includes("سعر") || lastUser.includes("التسعير") || lastUser.includes("pricing")) {
      reply = "خطط التسعير لدينا مرنة وتعتمد على حجم الاستخدام. راسلنا من صفحة الاتصال وسنزودك بعرض مناسب.";
    } else if (lastUser.includes("تواصل") || lastUser.includes("contact") || lastUser.includes("support")) {
      reply = "تقدر تتواصل معنا من صفحة الاتصال أو عبر البريد: support@kyctrust.example";
    } else if (lastUser.includes("order") || lastUser.includes("طلب") || lastUser.includes("orders")) {
      reply = "يمكنك إدارة الطلبات من لوحة التحكم. إذا كنت مسؤولاً، تأكد من تسجيل الدخول للوصول إلى إدارة الطلبات.";
    } else if (lastUser.includes("مستندات") || lastUser.includes("documents") || lastUser.includes("kyc")) {
      reply = "نقدّم حلول تحقق KYC موثوقة مع حماية البيانات. أخبرني بما تحتاجه وسأوجهك.";
    }

    return NextResponse.json({ reply })
  } catch (e) {
    return NextResponse.json({ reply: "حدث خطأ غير متوقع. حاول مرة أخرى لاحقاً." }, { status: 200 })
  }
}
