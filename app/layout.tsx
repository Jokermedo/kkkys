import type React from "react"
import "./globals.css"
import { inter, cairo } from "@/lib/config/fonts"
import { metadata } from "@/lib/config/metadata"
import { HeadLinks } from "@/components/layout/head-links"
import { AppProviders } from "@/components/providers/app-providers"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { ScrollProgress } from "@/components/animate/scroll-progress"
import { ChatWidget } from "@/components/ai/chat-widget"

export { metadata }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadLinks />
      </head>
      <body className={`${inter.variable} ${cairo.variable} font-sans antialiased`}>
        <AppProviders>
          <div className="relative flex min-h-screen flex-col">
            {/* Subtle scroll progress bar for a polished mobile experience */}
            <ScrollProgress />
            <SiteHeader />
            <main className="flex-1 pt-16">{children}</main>
            <SiteFooter />
          </div>
          {/* Global floating chat widget */}
          <ChatWidget />
        </AppProviders>
      </body>
    </html>
  )
}

