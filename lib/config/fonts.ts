import { Inter, Cairo } from "next/font/google"

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
  adjustFontFallback: true,
  weight: ["300", "400", "500", "600", "700"],
})

export const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Tahoma", "Arial", "sans-serif"],
  adjustFontFallback: true,
  weight: ["300", "400", "500", "600", "700"],
})
