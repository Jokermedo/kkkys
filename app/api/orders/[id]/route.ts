import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { z } from "zod"
import { getAdminFromRequest } from "@/lib/auth"
import { getSupabaseAdmin } from "@/lib/supabase/server"

const UpdateSchema = z.object({
  customerName: z.string().min(1).optional(),
  contact: z.string().min(3).optional(),
  serviceId: z.string().min(1).optional(),
  amount: z.number().nonnegative().optional(),
  notes: z.string().optional(),
  status: z.enum(["pending", "processing", "completed", "cancelled"]).optional(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAdminFromRequest(request)
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("orders")
    .select("id, created_at, updated_at, customer_name, contact, service_id, amount, notes, status")
    .eq("id", params.id)
    .single()

  if (error || !data) return NextResponse.json({ error: "غير موجود" }, { status: 404 })

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
  return NextResponse.json({ order })
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAdminFromRequest(request)
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

  try {
    const body = await request.json()
    const parsed = UpdateSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 })

    const supabase = getSupabaseAdmin()
    const payload: any = {}
    if (parsed.data.customerName !== undefined) payload.customer_name = parsed.data.customerName
    if (parsed.data.contact !== undefined) payload.contact = parsed.data.contact
    if (parsed.data.serviceId !== undefined) payload.service_id = parsed.data.serviceId
    if (parsed.data.amount !== undefined) payload.amount = parsed.data.amount
    if (parsed.data.notes !== undefined) payload.notes = parsed.data.notes
    if (parsed.data.status !== undefined) payload.status = parsed.data.status

    const { data, error } = await supabase
      .from("orders")
      .update(payload)
      .eq("id", params.id)
      .select("id, created_at, updated_at, customer_name, contact, service_id, amount, notes, status")
      .single()

    if (error || !data) return NextResponse.json({ error: "غير موجود" }, { status: 404 })

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
    return NextResponse.json({ order })
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAdminFromRequest(request)
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from("orders").delete().eq("id", params.id)
  if (error) return NextResponse.json({ error: "غير موجود" }, { status: 404 })
  return NextResponse.json({ ok: true })
}
