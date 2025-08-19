"use client"

import { Button } from "@/components/ui/button"
import { useCMS } from "@/lib/store"
import { ArrowLeft, ArrowRight, Mail, Phone } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  const { locale } = useCMS()

  const content = {
    ar: {
      title: "جاهز للبدء؟",
      subtitle: "انضم إلى آلاف الشركات التي تثق في خدماتنا",
      description: "احصل على استشارة مجانية واكتشف كيف يمكن لحلولنا أن تساعد شركتك",
      primaryCTA: "ابدأ الآن",
      secondaryCTA: "تحدث مع خبير",
      contact: {
        email: "info@kyctrust.com",
        phone: "+966 11 123 4567",
      },
    },
    en: {
      title: "Ready to Get Started?",
      subtitle: "Join thousands of companies that trust our services",
      description: "Get a free consultation and discover how our solutions can help your business",
      primaryCTA: "Get Started",
      secondaryCTA: "Talk to Expert",
      contact: {
        email: "info@kyctrust.com",
        phone: "+966 11 123 4567",
      },
    },
  }

  const currentContent = content[locale]

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="space-y-6 mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold">{currentContent.title}</h2>

            <p className="text-xl lg:text-2xl text-blue-100">{currentContent.subtitle}</p>

            <p className="text-lg text-blue-200 max-w-2xl mx-auto">{currentContent.description}</p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                {currentContent.primaryCTA}
                {locale === "ar" ? <ArrowLeft className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </Link>

            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
              >
                {currentContent.secondaryCTA}
              </Button>
            </Link>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-blue-200">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>{currentContent.contact.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>{currentContent.contact.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
