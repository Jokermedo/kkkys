"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { MessageCircle, X, Send, Minus } from "lucide-react"
import clsx from "clsx"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  }, [key, value])
  return [value, setValue] as const
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>(
    "chat_widget_messages",
    [
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "مرحباً! أنا مساعد كاي سي تراست. كيف أقدر أساعدك اليوم؟",
      },
    ],
  )
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [open, messages])

  const canSend = input.trim().length > 0 && !loading

  async function sendMessage() {
    if (!canSend) return
    const text = input.trim()
    setInput("")
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg].slice(-10) }),
      })
      if (!res.ok) throw new Error("Request failed")
      const data = (await res.json()) as { reply: string }
      const botMsg: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: data.reply }
      setMessages((prev) => [...prev, botMsg])
    } catch (e) {
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "تعذر الحصول على رد الآن. حاول لاحقاً أو تواصل معنا من صفحة الاتصال.",
      }
      setMessages((prev) => [...prev, botMsg])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const buttonTitle = open ? (minimized ? "توسيع المساعد" : "إغلاق المساعد") : "افتح المساعد"

  return (
    <div className="fixed z-50 bottom-6 right-6 md:bottom-8 md:right-8">
      {/* Floating Button */}
      {!open && (
        <button
          aria-label={buttonTitle}
          title={buttonTitle}
          onClick={() => setOpen(true)}
          className="group h-14 w-14 rounded-full shadow-xl bg-gradient-to-tr from-emerald-500 to-blue-500 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-150"
        >
          <MessageCircle className="h-7 w-7" />
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div
          className={clsx(
            "w-[92vw] sm:w-96 max-w-[92vw] rounded-2xl shadow-2xl overflow-hidden border border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70",
            minimized ? "h-16" : "h-[70vh] sm:h-[28rem]",
          )}
          role="dialog"
          aria-label="مساعد الدردشة"
        >
          {/* Header */}
          <div className="h-12 px-4 flex items-center justify-between bg-gradient-to-r from-emerald-500/90 to-blue-500/90 text-white">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-white/20 grid place-items-center">
                <MessageCircle className="h-4 w-4" />
              </div>
              <span className="font-medium">مساعد كاي سي تراست</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                aria-label="تصغير"
                className="p-1 rounded hover:bg-white/10"
                onClick={() => setMinimized((v) => !v)}
              >
                <Minus className="h-4 w-4" />
              </button>
              <button aria-label="إغلاق" className="p-1 rounded hover:bg-white/10" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          {!minimized && (
            <div className="flex flex-col h-[calc(100%-3rem)]">
              <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={clsx("flex", m.role === "user" ? "justify-end" : "justify-start")}> 
                    <div
                      className={clsx(
                        "max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm",
                        m.role === "user"
                          ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100"
                          : "bg-muted text-foreground",
                      )}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="text-xs text-muted-foreground">جاري كتابة الرد…</div>
                )}
              </div>
              <div className="p-3 border-t border-border grid grid-cols-[1fr_auto] gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="اكتب رسالتك…"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!canSend}
                  className={clsx(
                    "h-10 w-10 grid place-items-center rounded-xl text-white transition-colors",
                    canSend ? "bg-emerald-500 hover:bg-emerald-600" : "bg-muted text-muted-foreground cursor-not-allowed",
                  )}
                  aria-label="إرسال"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
