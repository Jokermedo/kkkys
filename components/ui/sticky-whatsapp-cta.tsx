"use client"

import Link from "next/link"
import { MessageCircle } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { useCMS } from "@/lib/store"
import { getWhatsAppLink } from "@/lib/config/contact"

export function StickyWhatsAppCTA() {
  const { locale, content } = useCMS()
  const bundle = content[locale]
  const prefersReducedMotion = useReducedMotion()

  const href = getWhatsAppLink(bundle.hero.whatsapp)

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center md:hidden">
      <motion.div
        initial={prefersReducedMotion ? false : { y: 40, opacity: 0 }}
        animate={prefersReducedMotion ? {} : { y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="pointer-events-auto"
      >
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-3 rounded-full shadow-xl text-white bg-gradient-to-r from-emerald-600 to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">
            {locale === "ar" ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
          </span>
        </Link>
      </motion.div>
    </div>
  )
}
