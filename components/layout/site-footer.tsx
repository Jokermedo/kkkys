"use client"

import * as React from "react"
import Link from "next/link"
import { Shield, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCMS } from "@/lib/store"

export function SiteFooter() {
  const [email, setEmail] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { locale, content } = useCMS()

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim() && !isSubmitting) {
      setIsSubmitting(true)
      try {
        // Handle newsletter subscription logic here
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
        setEmail("")
        // Show success message
      } catch (error) {
        // Handle error
        console.error("Newsletter subscription failed:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const quickLinks = [
    { name: locale === "ar" ? "الرئيسية" : "Home", href: "#home" },
    { name: locale === "ar" ? "الخدمات" : "Services", href: "#services" },
    { name: locale === "ar" ? "من نحن" : "About", href: "#about" },
    { name: locale === "ar" ? "التقييمات" : "Reviews", href: "#testimonials" },
    { name: locale === "ar" ? "الأسئلة الشائعة" : "FAQ", href: "#faq" },
    { name: locale === "ar" ? "اتصل بنا" : "Contact", href: "#contact" },
  ]

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/kyctrust", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/kyctrust", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/kyctrust", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com/company/kyctrust", label: "LinkedIn" },
  ]

  return (
    <footer className="bg-gray-900 text-white" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">KYC Trust</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{content[locale].about.description}</p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-primary transition-colors"
                  asChild
                >
                  <Link href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                    <Icon className="h-5 w-5" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">{locale === "ar" ? "روابط سريعة" : "Quick Links"}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">{locale === "ar" ? "خدماتنا" : "Our Services"}</h3>
            <ul className="space-y-2">
              {content[locale].services.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <span className="text-gray-300 text-sm hover:text-primary transition-colors cursor-default">
                    {service.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">{content[locale].contact.title}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <Link
                  href={`tel:${content[locale].contact.phone}`}
                  className="text-gray-300 text-sm hover:text-primary transition-colors"
                >
                  {content[locale].contact.phone}
                </Link>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <Link
                  href={`mailto:${content[locale].contact.email}`}
                  className="text-gray-300 text-sm hover:text-primary transition-colors"
                >
                  {content[locale].contact.email}
                </Link>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-gray-300 text-sm">{content[locale].contact.address}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-primary">
                {locale === "ar" ? "اشترك في النشرة الإخبارية" : "Subscribe to Newsletter"}
              </h4>
              <form onSubmit={handleNewsletterSubmit} className="flex space-x-2 rtl:space-x-reverse">
                <Input
                  type="email"
                  placeholder={locale === "ar" ? "بريدك الإلكتروني" : "Your email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-primary"
                  required
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? locale === "ar"
                      ? "جاري..."
                      : "Loading..."
                    : locale === "ar"
                      ? "اشترك"
                      : "Subscribe"}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 KYC Trust. {locale === "ar" ? "جميع الحقوق محفوظة" : "All rights reserved"}.
            </p>
            <div className="flex space-x-6 rtl:space-x-reverse">
              <Link href="/privacy" className="text-gray-400 hover:text-primary text-sm transition-colors duration-200">
                {locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-primary text-sm transition-colors duration-200">
                {locale === "ar" ? "شروط الاستخدام" : "Terms of Service"}
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-primary text-sm transition-colors duration-200">
                {locale === "ar" ? "سياسة ملفات تعريف الارتباط" : "Cookie Policy"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
