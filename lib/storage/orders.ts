import { readJson, writeJson } from "./json-store"
import { randomUUID } from "crypto"

export type Order = {
  id: string
  createdAt: string
  updatedAt: string
  customerName: string
  contact: string
  serviceId: string
  amount: number
  notes?: string
  status: "pending" | "processing" | "completed" | "cancelled"
}

export type OrdersDB = {
  orders: Order[]
}

const DB_PATH = process.env.ORDERS_DB_PATH || ".data/orders.json"

async function load(): Promise<OrdersDB> {
  return await readJson<OrdersDB>(DB_PATH, { orders: [] })
}

async function save(db: OrdersDB): Promise<void> {
  await writeJson(DB_PATH, db)
}

export async function listOrders(): Promise<Order[]> {
  const db = await load()
  // newest first
  return db.orders.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const db = await load()
  return db.orders.find((o) => o.id === id)
}

export async function createOrder(input: Omit<Order, "id" | "createdAt" | "updatedAt" | "status"> & { status?: Order["status"] }): Promise<Order> {
  const now = new Date().toISOString()
  const order: Order = {
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    status: input.status ?? "pending",
    customerName: input.customerName,
    contact: input.contact,
    serviceId: input.serviceId,
    amount: input.amount,
    notes: input.notes,
  }
  const db = await load()
  db.orders.push(order)
  await save(db)
  return order
}

export async function updateOrder(id: string, patch: Partial<Omit<Order, "id" | "createdAt">>): Promise<Order | undefined> {
  const db = await load()
  const idx = db.orders.findIndex((o) => o.id === id)
  if (idx === -1) return undefined
  const prev = db.orders[idx]
  const next: Order = { ...prev, ...patch, id: prev.id, createdAt: prev.createdAt, updatedAt: new Date().toISOString() }
  db.orders[idx] = next
  await save(db)
  return next
}

export async function deleteOrder(id: string): Promise<boolean> {
  const db = await load()
  const before = db.orders.length
  db.orders = db.orders.filter((o) => o.id !== id)
  const changed = db.orders.length !== before
  if (changed) await save(db)
  return changed
}
