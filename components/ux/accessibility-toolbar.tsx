"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Accessibility,
  Volume2,
  MousePointer,
  Keyboard,
  Palette,
  Type,
  Settings,
  Contrast,
  ZoomIn,
  Focus,
  Eye,
} from "lucide-react"
import { uxOptimizer, type UserPreferences } from "@/lib/ux/user-experience-optimizer"

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [preferences, setPreferences] = useState<UserPreferences>({
    reducedMotion: false,
    highContrast: false,
    fontSize: "medium",
    theme: "auto",
    language: "ar",
  })

  const [accessibilityFeatures, setAccessibilityFeatures] = useState({
    screenReader: false,
    keyboardNavigation: false,
    voiceControl: false,
    touchDevice: false,
  })

  const [advancedSettings, setAdvancedSettings] = useState({
    focusIndicator: true,
    skipLinks: true,
    readingGuide: false,
    magnifier: false,
    colorBlindness: "none",
    textSpacing: 100,
  })

  useEffect(() => {
    const currentPrefs = uxOptimizer.getPreferences()
    setPreferences(currentPrefs)

    setAccessibilityFeatures({
      screenReader: detectScreenReader(),
      keyboardNavigation: detectKeyboardUser(),
      voiceControl: detectVoiceControl(),
      touchDevice: detectTouchDevice(),
    })

    // Initialize UX optimizer
    uxOptimizer.initialize()
  }, [])

  const detectScreenReader = () => {
    return !!(
      navigator.userAgent.match(/NVDA|JAWS|VoiceOver|TalkBack|Dragon/i) ||
      window.speechSynthesis ||
      document.querySelector("[aria-live]")
    )
  }

  const detectKeyboardUser = () => {
    return document.documentElement.classList.contains("keyboard-navigation")
  }

  const detectVoiceControl = () => {
    return !!(window as any).webkitSpeechRecognition || !!(window as any).SpeechRecognition
  }

  const detectTouchDevice = () => {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0
  }

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
    uxOptimizer.updatePreference(key, value)
    uxOptimizer.announceToScreenReader(`تم تغيير ${getPreferenceLabel(key)} إلى ${value}`)
  }

  const updateAdvancedSetting = (key: string, value: any) => {
    setAdvancedSettings((prev) => ({ ...prev, [key]: value }))
    applyAdvancedSetting(key, value)
  }

  const applyAdvancedSetting = (key: string, value: any) => {
    switch (key) {
      case "focusIndicator":
        document.documentElement.classList.toggle("enhanced-focus", value)
        break
      case "skipLinks":
        toggleSkipLinks(value)
        break
      case "readingGuide":
        toggleReadingGuide(value)
        break
      case "magnifier":
        toggleMagnifier(value)
        break
      case "colorBlindness":
        applyColorBlindnessFilter(value)
        break
      case "textSpacing":
        applyTextSpacing(value)
        break
    }
  }

  const toggleSkipLinks = (enabled: boolean) => {
    const existingSkipLinks = document.querySelector(".skip-links")
    if (enabled && !existingSkipLinks) {
      const skipLinks = document.createElement("div")
      skipLinks.className = "skip-links"
      skipLinks.innerHTML = `
        <a href="#main-content" class="skip-link">تخطي إلى المحتوى الرئيسي</a>
        <a href="#navigation" class="skip-link">تخطي إلى التنقل</a>
        <a href="#footer" class="skip-link">تخطي إلى التذييل</a>
      `
      document.body.insertBefore(skipLinks, document.body.firstChild)
    } else if (!enabled && existingSkipLinks) {
      existingSkipLinks.remove()
    }
  }

  const toggleReadingGuide = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add("reading-guide")
      addReadingGuideStyles()
    } else {
      document.documentElement.classList.remove("reading-guide")
    }
  }

  const addReadingGuideStyles = () => {
    if (!document.querySelector("#reading-guide-styles")) {
      const style = document.createElement("style")
      style.id = "reading-guide-styles"
      style.textContent = `
        .reading-guide p:hover,
        .reading-guide h1:hover,
        .reading-guide h2:hover,
        .reading-guide h3:hover,
        .reading-guide li:hover {
          background-color: rgba(59, 130, 246, 0.1);
          outline: 2px solid rgba(59, 130, 246, 0.3);
          border-radius: 4px;
        }
      `
      document.head.appendChild(style)
    }
  }

  const toggleMagnifier = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add("magnifier-enabled")
      addMagnifierStyles()
    } else {
      document.documentElement.classList.remove("magnifier-enabled")
    }
  }

  const addMagnifierStyles = () => {
    if (!document.querySelector("#magnifier-styles")) {
      const style = document.createElement("style")
      style.id = "magnifier-styles"
      style.textContent = `
        .magnifier-enabled *:hover {
          transform: scale(1.1);
          transition: transform 0.2s ease;
          z-index: 10;
          position: relative;
        }
      `
      document.head.appendChild(style)
    }
  }

  const applyColorBlindnessFilter = (type: string) => {
    const filters = {
      none: "none",
      protanopia: "url(#protanopia)",
      deuteranopia: "url(#deuteranopia)",
      tritanopia: "url(#tritanopia)",
    }

    document.documentElement.style.filter = filters[type as keyof typeof filters] || "none"

    if (type !== "none" && !document.querySelector("#colorblind-filters")) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      svg.id = "colorblind-filters"
      svg.style.position = "absolute"
      svg.style.width = "0"
      svg.style.height = "0"
      svg.innerHTML = `
        <defs>
          <filter id="protanopia">
            <feColorMatrix values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0"/>
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0"/>
          </filter>
          <filter id="tritanopia">
            <feColorMatrix values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0"/>
          </filter>
        </defs>
      `
      document.body.appendChild(svg)
    }
  }

  const applyTextSpacing = (spacing: number) => {
    const scale = spacing / 100
    document.documentElement.style.setProperty("--text-spacing-scale", scale.toString())

    if (!document.querySelector("#text-spacing-styles")) {
      const style = document.createElement("style")
      style.id = "text-spacing-styles"
      style.textContent = `
        :root {
          --text-spacing-scale: 1;
        }
        
        p, li, span {
          line-height: calc(1.5 * var(--text-spacing-scale)) !important;
          letter-spacing: calc(0.05em * var(--text-spacing-scale)) !important;
          word-spacing: calc(0.1em * var(--text-spacing-scale)) !important;
        }
      `
      document.head.appendChild(style)
    }
  }

  const getPreferenceLabel = (key: keyof UserPreferences): string => {
    const labels = {
      reducedMotion: "تقليل الحركة",
      highContrast: "التباين العالي",
      fontSize: "حجم الخط",
      theme: "المظهر",
      language: "اللغة",
    }
    return labels[key]
  }

  const fontSizeOptions = [
    { value: "small", label: "صغير", size: "14px", description: "نص صغير للشاشات الكبيرة" },
    { value: "medium", label: "متوسط", size: "16px", description: "الحجم الافتراضي الموصى به" },
    { value: "large", label: "كبير", size: "18px", description: "نص كبير لسهولة القراءة" },
  ]

  const themeOptions = [
    { value: "light", label: "فاتح", icon: "☀️", description: "مظهر فاتح للإضاءة الجيدة" },
    { value: "dark", label: "داكن", icon: "🌙", description: "مظهر داكن لتقليل إجهاد العين" },
    { value: "auto", label: "تلقائي", icon: "🔄", description: "يتبع إعدادات النظام" },
  ]

  const colorBlindnessOptions = [
    { value: "none", label: "عادي" },
    { value: "protanopia", label: "عمى الأحمر" },
    { value: "deuteranopia", label: "عمى الأخضر" },
    { value: "tritanopia", label: "عمى الأزرق" },
  ]

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 shadow-lg focus:ring-4 focus:ring-primary/50 bg-primary hover:bg-primary/90"
        size="icon"
        aria-label="فتح أدوات إمكانية الوصول - اضغط Enter للفتح"
        aria-describedby="accessibility-toolbar-description"
        title="أدوات إمكانية الوصول"
      >
        <Accessibility className="h-5 w-5" aria-hidden="true" />
      </Button>

      <div id="accessibility-toolbar-description" className="sr-only">
        شريط أدوات إمكانية الوصول يحتوي على خيارات لتخصيص تجربة التصفح حسب احتياجاتك
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-toolbar-title"
          onKeyDown={handleKeyDown}
        >
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto focus:outline-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle id="accessibility-toolbar-title" className="flex items-center gap-2">
                <Accessibility className="h-5 w-5" aria-hidden="true" />
                أدوات إمكانية الوصول
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                aria-label="إغلاق أدوات إمكانية الوصول"
                className="focus:ring-2 focus:ring-primary"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {(accessibilityFeatures.screenReader || accessibilityFeatures.keyboardNavigation) && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <h3 className="text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-2">الميزات المكتشفة</h3>
                  <div className="flex flex-wrap gap-2">
                    {accessibilityFeatures.screenReader && (
                      <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-800">
                        <Volume2 className="h-3 w-3 mr-1" aria-hidden="true" />
                        قارئ الشاشة
                      </Badge>
                    )}
                    {accessibilityFeatures.keyboardNavigation && (
                      <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-800">
                        <Keyboard className="h-3 w-3 mr-1" aria-hidden="true" />
                        التنقل بلوحة المفاتيح
                      </Badge>
                    )}
                    {accessibilityFeatures.touchDevice && (
                      <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-800">
                        <MousePointer className="h-3 w-3 mr-1" aria-hidden="true" />
                        جهاز لمسي
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <MousePointer className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <div>
                    <span className="text-sm font-medium">تقليل الحركة</span>
                    <p className="text-xs text-muted-foreground">تقليل الرسوم المتحركة والانتقالات</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.reducedMotion}
                  onCheckedChange={(checked) => updatePreference("reducedMotion", checked)}
                  aria-label="تفعيل أو إلغاء تقليل الحركة"
                  aria-describedby="motion-description"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Contrast className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <div>
                    <span className="text-sm font-medium">التباين العالي</span>
                    <p className="text-xs text-muted-foreground">زيادة التباين لسهولة القراءة</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.highContrast}
                  onCheckedChange={(checked) => updatePreference("highContrast", checked)}
                  aria-label="تفعيل أو إلغاء التباين العالي"
                  aria-describedby="contrast-description"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="text-sm font-medium">حجم الخط</span>
                </div>
                <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="اختيار حجم الخط">
                  {fontSizeOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={preferences.fontSize === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => updatePreference("fontSize", option.value as any)}
                      className="text-xs flex flex-col items-center gap-1 h-auto py-2"
                      style={{ fontSize: option.size }}
                      role="radio"
                      aria-checked={preferences.fontSize === option.value}
                      aria-describedby={`font-${option.value}-description`}
                      title={option.description}
                    >
                      <span>Aa</span>
                      <span>{option.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="text-sm font-medium">المظهر</span>
                </div>
                <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="اختيار المظهر">
                  {themeOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={preferences.theme === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => updatePreference("theme", option.value as any)}
                      className="text-xs flex items-center gap-1 h-auto py-2"
                      role="radio"
                      aria-checked={preferences.theme === option.value}
                      title={option.description}
                    >
                      <span role="img" aria-hidden="true">
                        {option.icon}
                      </span>
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="text-sm font-medium">اللغة</span>
                </div>
                <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="اختيار اللغة">
                  <Button
                    variant={preferences.language === "ar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updatePreference("language", "ar")}
                    className="text-xs"
                    role="radio"
                    aria-checked={preferences.language === "ar"}
                  >
                    العربية
                  </Button>
                  <Button
                    variant={preferences.language === "en" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updatePreference("language", "en")}
                    className="text-xs"
                    role="radio"
                    aria-checked={preferences.language === "en"}
                  >
                    English
                  </Button>
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  إعدادات متقدمة
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Focus className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-sm font-medium">مؤشر التركيز المحسن</span>
                        <p className="text-xs text-muted-foreground">تحسين مؤشرات التركيز</p>
                      </div>
                    </div>
                    <Switch
                      checked={advancedSettings.focusIndicator}
                      onCheckedChange={(checked) => updateAdvancedSetting("focusIndicator", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <MousePointer className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-sm font-medium">روابط التخطي</span>
                        <p className="text-xs text-muted-foreground">روابط للتنقل السريع</p>
                      </div>
                    </div>
                    <Switch
                      checked={advancedSettings.skipLinks}
                      onCheckedChange={(checked) => updateAdvancedSetting("skipLinks", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-sm font-medium">دليل القراءة</span>
                        <p className="text-xs text-muted-foreground">تمييز النص عند التمرير</p>
                      </div>
                    </div>
                    <Switch
                      checked={advancedSettings.readingGuide}
                      onCheckedChange={(checked) => updateAdvancedSetting("readingGuide", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <ZoomIn className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-sm font-medium">المكبر</span>
                        <p className="text-xs text-muted-foreground">تكبير العناصر عند التمرير</p>
                      </div>
                    </div>
                    <Switch
                      checked={advancedSettings.magnifier}
                      onCheckedChange={(checked) => updateAdvancedSetting("magnifier", checked)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">عمى الألوان</label>
                  <div className="grid grid-cols-2 gap-2">
                    {colorBlindnessOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={advancedSettings.colorBlindness === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateAdvancedSetting("colorBlindness", option.value)}
                        className="text-xs"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">تباعد النص: {advancedSettings.textSpacing}%</label>
                  <Slider
                    value={[advancedSettings.textSpacing]}
                    onValueChange={([value]) => updateAdvancedSetting("textSpacing", value)}
                    min={80}
                    max={200}
                    step={10}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div id="accessibility-announcements" aria-live="polite" aria-atomic="true" className="sr-only" />
    </>
  )
}
