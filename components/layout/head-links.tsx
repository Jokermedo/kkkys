export function HeadLinks() {
  return (
    <>
      <link rel="icon" href="/favicon.ico" sizes="32x32" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#3b82f6" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#1e40af" media="(prefers-color-scheme: dark)" />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

      {/* تحسين الاتصال بالخطوط */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* تحسين DNS للخدمات الخارجية */}
      <link rel="dns-prefetch" href="https://wa.me" />
      <link rel="dns-prefetch" href="https://api.whatsapp.com" />
      <link rel="dns-prefetch" href="https://images.unsplash.com" />

      {/* تحميل مسبق للصور المهمة */}
      <link rel="preload" href="/images/brand/kyctrust-logo.png" as="image" type="image/png" />
      <link rel="preload" href="/images/logos/paypal.png" as="image" type="image/png" />
      <link rel="preload" href="/images/logos/payoneer.png" as="image" type="image/png" />

      {/* تحسينات الأمان */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
    </>
  )
}
