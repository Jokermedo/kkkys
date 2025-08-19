"use client"
import { useCMS } from "@/lib/store"
import { lazy, Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

const EnhancedHeroBlock = lazy(() =>
  import("./enhanced-hero-block").then((m) => ({ default: m.EnhancedHeroBlock }))
)
const ServicesSection = lazy(() => import("./services-section").then((m) => ({ default: m.ServicesSection })))
const AboutSection = lazy(() => import("./about-section").then((m) => ({ default: m.AboutSection })))
const TestimonialsSection = lazy(() =>
  import("./testimonials-section").then((m) => ({ default: m.TestimonialsSection })),
)
const FAQSection = lazy(() => import("./faq-section").then((m) => ({ default: m.FAQSection })))
const ContactSection = lazy(() => import("./contact-section").then((m) => ({ default: m.ContactSection })))

function BlockSkeleton() {
  return (
    <div className="w-full py-16">
      <div className="container mx-auto px-4">
        <Skeleton className="h-8 w-64 mx-auto mb-4" />
        <Skeleton className="h-4 w-96 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function BlocksRenderer() {
  const { blocks } = useCMS()

  const blockComponents = {
    hero: () => <EnhancedHeroBlock />,
    services: () => <ServicesSection />,
    about: () => <AboutSection />,
    testimonials: () => <TestimonialsSection />,
    faq: () => <FAQSection />,
    contact: () => <ContactSection />,
  }

  return (
    <div>
      {blocks
        .filter((block) => block.enabled)
        .sort((a, b) => a.order - b.order)
        .map((block) => {
          const Component = blockComponents[block.type as keyof typeof blockComponents]
          return Component ? (
            <section key={block.id} id={block.id}>
              <Suspense fallback={<BlockSkeleton />}>{Component()}</Suspense>
            </section>
          ) : null
        })}
    </div>
  )
}

