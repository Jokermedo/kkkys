import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { z } from "zod"
import { getAdminFromRequest } from "@/lib/auth"
import { getSupabaseAdmin } from "@/lib/supabase/server"

const CreateOrderSchema = z.object({
  customerName: z.string().min(1),
  contact: z.string().min(3),
  serviceId: z.string().min(1),
  amount: z.number().nonnegative(),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const user = await getAdminFromRequest(request)
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("orders")
    .select("id, created_at, updated_at, customer_name, contact, service_id, amount, notes, status")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })

  const orders = (data || []).map((r) => ({
    id: r.id as string,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
    customerName: (r.customer_name as string) ?? "",
    contact: (r.contact as string) ?? "",
    serviceId: (r.service_id as string) ?? "",
    amount: Number(r.amount) || 0,
    notes: (r.notes as string) ?? undefined,
    status: (r.status as any) ?? "pending",
  }))

  return NextResponse.json({ orders })
}

export async function POST(request: NextRequest) {
  const user = await getAdminFromRequest(request)
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

  try {
    const body = await request.json()
    const parsed = CreateOrderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "بيانات غير صالحة", details: parsed.error.format() }, { status: 400 })
    }
    const supabase = getSupabaseAdmin()
    const payload = {
      customer_name: parsed.data.customerName,
      contact: parsed.data.contact,
      service_id: parsed.data.serviceId,
      amount: parsed.data.amount,
      notes: parsed.data.notes ?? null,
      status: "pending",
    }
    const { data, error } = await supabase
      .from("orders")
      .insert(payload)
      .select("id, created_at, updated_at, customer_name, contact, service_id, amount, notes, status")
      .single()

    if (error || !data) return NextResponse.json({ error: "فشل إنشاء الطلب" }, { status: 500 })

    const order = {
      id: data.id as string,
      createdAt: data.created_at as string,
      updatedAt: data.updated_at as string,
      customerName: (data.customer_name as string) ?? "",
      contact: (data.contact as string) ?? "",
      serviceId: (data.service_id as string) ?? "",
      amount: Number(data.amount) || 0,
      notes: (data.notes as string) ?? undefined,
      status: (data.status as any) ?? "pending",
    }
    return NextResponse.json({ order }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  }
}
