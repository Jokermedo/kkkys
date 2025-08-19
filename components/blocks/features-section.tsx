"use client"

import { useCMS } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, TrendingUp, Clock, Award } from "lucide-react"

export function FeaturesSection() {
  const { locale } = useCMS()

  const content = {
    ar: {
      badge: "لماذا نحن؟",
      title: "المنصة الأكثر موثوقية في المنطقة",
      subtitle: "نحن نقدم حلول متطورة تلبي احتياجات الشركات الحديثة",
      stats: [
        { icon: TrendingUp, value: "99.9%", label: "دقة التحقق" },
        { icon: Clock, value: "<30s", label: "وقت المعالجة" },
        { icon: Award, value: "200+", label: "دولة مدعومة" },
        { icon: CheckCircle, value: "24/7", label: "دعم فني" },
      ],
      features: [
        "تكامل سهل مع الأنظمة الموجودة",
        "واجهة برمجة تطبيقات قوية ومرنة",
        "تقارير مفصلة وتحليلات متقدمة",
        "امتثال كامل للمعايير الدولية",
        "حماية البيانات بأعلى المستويات",
        "دعم متعدد اللغات والعملات",
      ],
    },
    en: {
      badge: "Why Choose Us?",
      title: "The Most Trusted Platform in the Region",
      subtitle: "We provide advanced solutions that meet the needs of modern businesses",
      stats: [
        { icon: TrendingUp, value: "99.9%", label: "Verification Accuracy" },
        { icon: Clock, value: "<30s", label: "Processing Time" },
        { icon: Award, value: "200+", label: "Countries Supported" },
        { icon: CheckCircle, value: "24/7", label: "Technical Support" },
      ],
      features: [
        "Easy integration with existing systems",
        "Powerful and flexible API",
        "Detailed reports and advanced analytics",
        "Full compliance with international standards",
        "Data protection at the highest levels",
        "Multi-language and currency support",
      ],
    },
  }

  const currentContent = content[locale]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                {currentContent.badge}
              </Badge>

              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{currentContent.title}</h2>

              <p className="text-xl text-gray-600 leading-relaxed">{currentContent.subtitle}</p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {currentContent.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            {currentContent.stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
