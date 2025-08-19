"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  FileText,
  Shield,
  Search,
  Filter,
  Download,
  Plus,
  Settings,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Globe,
  Lock,
} from "lucide-react"
import { useCMS } from "@/lib/store"

type Order = {
  id: string
  createdAt: string
  updatedAt: string
  customerName: string
  contact: string
  serviceId: string
  amount: number
  notes?: string
  status: "pending" | "processing" | "completed" | "cancelled"
}

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedDateRange, setSelectedDateRange] = useState("7d")
  const { locale, content, setContent, design, setDesign } = useCMS()

  // Orders state
  const [orders, setOrders] = useState<Order[]>([])
  const [orderForm, setOrderForm] = useState({ customerName: "", contact: "", serviceId: "", amount: "", notes: "" })
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [creating, setCreating] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)

  async function fetchOrders() {
    setLoadingOrders(true)
    try {
      const res = await fetch("/api/orders", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders ?? [])
      }
    } finally {
      setLoadingOrders(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  async function createOrder() {
    setCreating(true)
    try {
      const payload = {
        customerName: orderForm.customerName.trim(),
        contact: orderForm.contact.trim(),
        serviceId: orderForm.serviceId.trim(),
        amount: Number(orderForm.amount) || 0,
        notes: orderForm.notes?.trim() || undefined,
      }
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      if (res.ok) {
        setOrderForm({ customerName: "", contact: "", serviceId: "", amount: "", notes: "" })
        await fetchOrders()
      }
    } finally {
      setCreating(false)
    }
  }

  async function updateOrder(id: string, patch: Partial<Order>) {
    setSavingId(id)
    try {
      await fetch(`/api/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) })
      await fetchOrders()
    } finally {
      setSavingId(null)
    }
  }

  async function deleteOrder(id: string) {
    setSavingId(id)
    try {
      await fetch(`/api/orders/${id}`, { method: "DELETE" })
      await fetchOrders()
    } finally {
      setSavingId(null)
    }
  }

  const stats = [
    {
      title: "إجمالي المستخدمين",
      value: "1,234",
      icon: Users,
      change: "+12%",
      trend: "up",
      description: "مستخدم نشط هذا الشهر",
    },
    {
      title: "طلبات التحقق",
      value: "856",
      icon: FileText,
      change: "+8%",
      trend: "up",
      description: "طلب جديد هذا الأسبوع",
    },
    {
      title: "معدل النجاح",
      value: "99.2%",
      icon: Shield,
      change: "+0.3%",
      trend: "up",
      description: "من إجمالي الطلبات",
    },
    {
      title: "الطلبات النشطة",
      value: "42",
      icon: Clock,
      change: "-5%",
      trend: "down",
      description: "طلب قيد المراجعة",
    },
  ]

  const recentVerifications = [
    {
      id: "VER-001",
      user: "أحمد محمد",
      email: "ahmed@example.com",
      status: "مكتمل",
      date: "2024-01-15",
      time: "14:30",
      type: "هوية شخصية",
      priority: "عادي",
      assignedTo: "مراجع 1",
    },
    {
      id: "VER-002",
      user: "فاطمة علي",
      email: "fatima@example.com",
      status: "قيد المراجعة",
      date: "2024-01-15",
      time: "13:45",
      type: "رخصة قيادة",
      priority: "عالي",
      assignedTo: "مراجع 2",
    },
    {
      id: "VER-003",
      user: "محمد سالم",
      email: "mohammed@example.com",
      status: "مرفوض",
      date: "2024-01-14",
      time: "16:20",
      type: "جواز سفر",
      priority: "عادي",
      assignedTo: "مراجع 1",
    },
    {
      id: "VER-004",
      user: "نورا أحمد",
      email: "nora@example.com",
      status: "مكتمل",
      date: "2024-01-14",
      time: "11:15",
      type: "هوية شخصية",
      priority: "منخفض",
      assignedTo: "مراجع 3",
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      مكتمل: { variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
      "قيد المراجعة": { variant: "secondary" as const, icon: Clock, color: "text-yellow-600" },
      مرفوض: { variant: "destructive" as const, icon: XCircle, color: "text-red-600" },
    }

    const config = variants[status as keyof typeof variants] || variants["قيد المراجعة"]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      عالي: "destructive" as const,
      عادي: "secondary" as const,
      منخفض: "outline" as const,
    }

    return <Badge variant={variants[priority as keyof typeof variants] || "secondary"}>{priority}</Badge>
  }

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    )
  }

  const filteredVerifications = recentVerifications.filter((verification) => {
    const matchesSearch =
      verification.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || verification.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">لوحة التحكم الإدارية</h1>
            <p className="text-muted-foreground">إدارة وتتبع جميع عمليات التحقق من الهوية</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">آخر 7 أيام</SelectItem>
                <SelectItem value="30d">آخر 30 يوم</SelectItem>
                <SelectItem value="90d">آخر 90 يوم</SelectItem>
                <SelectItem value="1y">آخر سنة</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              تصدير التقرير
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(stat.trend)}
                      <span
                        className={`text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="verifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="verifications">طلبات التحقق</TabsTrigger>
            <TabsTrigger value="orders">الطلبات</TabsTrigger>
            <TabsTrigger value="users">المستخدمين</TabsTrigger>
            <TabsTrigger value="reports">التقارير</TabsTrigger>
            <TabsTrigger value="content">إدارة المحتوى</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          {/* Verifications Tab */}
          <TabsContent value="verifications" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>طلبات التحقق الأخيرة</CardTitle>
                    <CardDescription>إدارة ومراجعة جميع طلبات التحقق من الهوية</CardDescription>
                  </div>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      تصفية
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      تصدير
                    </Button>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      طلب جديد
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filters */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="البحث في الطلبات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="تصفية حسب الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="مكتمل">مكتمل</SelectItem>
                      <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                      <SelectItem value="مرفوض">مرفوض</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">رقم الطلب</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">المستخدم</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">نوع الوثيقة</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">الأولوية</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">الحالة</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">التاريخ</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">المراجع</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVerifications.map((verification) => (
                        <tr key={verification.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 font-mono text-sm">{verification.id}</td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">{verification.user}</div>
                              <div className="text-sm text-muted-foreground">{verification.email}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{verification.type}</td>
                          <td className="py-3 px-4">{getPriorityBadge(verification.priority)}</td>
                          <td className="py-3 px-4">{getStatusBadge(verification.status)}</td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="text-sm">{verification.date}</div>
                              <div className="text-xs text-muted-foreground">{verification.time}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">{verification.assignedTo}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredVerifications.length === 0 && (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">لا توجد نتائج تطابق البحث</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>إدارة الطلبات</CardTitle>
                    <CardDescription>عرض، إنشاء، وتحديث الطلبات</CardDescription>
                  </div>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button variant="outline" size="sm" onClick={fetchOrders} disabled={loadingOrders}>
                      <Download className="w-4 h-4 mr-2" />
                      تحديث
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Create form */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <Input placeholder="اسم العميل" value={orderForm.customerName} onChange={(e) => setOrderForm((s) => ({ ...s, customerName: e.target.value }))} />
                  <Input placeholder="وسيلة التواصل" value={orderForm.contact} onChange={(e) => setOrderForm((s) => ({ ...s, contact: e.target.value }))} />
                  <Input placeholder="معرّف الخدمة" value={orderForm.serviceId} onChange={(e) => setOrderForm((s) => ({ ...s, serviceId: e.target.value }))} />
                  <Input placeholder="المبلغ" type="number" value={orderForm.amount} onChange={(e) => setOrderForm((s) => ({ ...s, amount: e.target.value }))} />
                  <div className="flex gap-2">
                    <Input placeholder="ملاحظات (اختياري)" value={orderForm.notes} onChange={(e) => setOrderForm((s) => ({ ...s, notes: e.target.value }))} />
                    <Button onClick={createOrder} disabled={creating}>
                      <Plus className="w-4 h-4 mr-2" /> إضافة
                    </Button>
                  </div>
                </div>

                {/* Orders table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">#</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">العميل</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">التواصل</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">الخدمة</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">المبلغ</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">الحالة</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">أُنشئ</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 font-mono text-xs">{o.id.slice(0, 8)}</td>
                          <td className="py-3 px-4">{o.customerName}</td>
                          <td className="py-3 px-4">{o.contact}</td>
                          <td className="py-3 px-4">{o.serviceId}</td>
                          <td className="py-3 px-4">{o.amount}</td>
                          <td className="py-3 px-4">
                            <Select value={o.status} onValueChange={(v) => updateOrder(o.id, { status: v as Order["status"] })}>
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">قيد الانتظار</SelectItem>
                                <SelectItem value="processing">قيد التنفيذ</SelectItem>
                                <SelectItem value="completed">مكتمل</SelectItem>
                                <SelectItem value="cancelled">ملغي</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-3 px-4 text-xs">{new Date(o.createdAt).toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" disabled={savingId === o.id} onClick={() => updateOrder(o.id, { notes: (o.notes || "") + "" })}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" disabled={savingId === o.id} onClick={() => deleteOrder(o.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {orders.length === 0 && !loadingOrders && (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">لا توجد طلبات حتى الآن</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    إدارة المحتوى
                  </CardTitle>
                  <CardDescription>تحرير محتوى الموقع والخدمات</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hero-title">عنوان الصفحة الرئيسية</Label>
                    <Input
                      id="hero-title"
                      value={content[locale].hero.title}
                      onChange={(e) =>
                        setContent(locale, {
                          hero: { ...content[locale].hero, title: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hero-subtitle">العنوان الفرعي</Label>
                    <Input
                      id="hero-subtitle"
                      value={content[locale].hero.subtitle}
                      onChange={(e) =>
                        setContent(locale, {
                          hero: { ...content[locale].hero, subtitle: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hero-description">الوصف</Label>
                    <Textarea
                      id="hero-description"
                      value={content[locale].hero.description}
                      onChange={(e) =>
                        setContent(locale, {
                          hero: { ...content[locale].hero, description: e.target.value },
                        })
                      }
                      rows={4}
                    />
                  </div>

                  <Button>حفظ التغييرات</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    إعدادات التصميم
                  </CardTitle>
                  <CardDescription>تخصيص ألوان وتصميم الموقع</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">اللون الأساسي</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={design.primaryColor}
                        onChange={(e) => setDesign({ primaryColor: e.target.value })}
                        className="w-16 h-10"
                      />
                      <Input
                        value={design.primaryColor}
                        onChange={(e) => setDesign({ primaryColor: e.target.value })}
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">اللون الثانوي</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={design.secondaryColor}
                        onChange={(e) => setDesign({ secondaryColor: e.target.value })}
                        className="w-16 h-10"
                      />
                      <Input
                        value={design.secondaryColor}
                        onChange={(e) => setDesign({ secondaryColor: e.target.value })}
                        placeholder="#1e40af"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="font-family">نوع الخط</Label>
                    <Select value={design.fontFamily} onValueChange={(value) => setDesign({ fontFamily: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Cairo">Cairo</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button>حفظ التصميم</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>إدارة المستخدمين</CardTitle>
                <CardDescription>عرض وإدارة جميع المستخدمين المسجلين في النظام</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">قريباً - إدارة المستخدمين</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>التقارير والإحصائيات</CardTitle>
                <CardDescription>تقارير مفصلة حول أداء النظام والإحصائيات</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">قريباً - التقارير والإحصائيات</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    إعدادات عامة
                  </CardTitle>
                  <CardDescription>تكوين الإعدادات الأساسية للنظام</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">اسم الموقع</Label>
                    <Input id="site-name" defaultValue="KYC Trust" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-email">البريد الإلكتروني للإدارة</Label>
                    <Input id="admin-email" type="email" defaultValue="admin@kyctrust.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-file-size">الحد الأقصى لحجم الملف (MB)</Label>
                    <Input id="max-file-size" type="number" defaultValue="10" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>تفعيل التسجيل الجديد</Label>
                      <p className="text-sm text-muted-foreground">السماح للمستخدمين الجدد بالتسجيل</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>تفعيل الإشعارات</Label>
                      <p className="text-sm text-muted-foreground">إرسال إشعارات البريد الإلكتروني</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Button>حفظ الإعدادات</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    إعدادات الأمان
                  </CardTitle>
                  <CardDescription>تكوين إعدادات الأمان والحماية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>المصادقة الثنائية</Label>
                      <p className="text-sm text-muted-foreground">تفعيل المصادقة الثنائية للإدارة</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>تسجيل العمليات</Label>
                      <p className="text-sm text-muted-foreground">تسجيل جميع العمليات الإدارية</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">انتهاء الجلسة (دقيقة)</Label>
                    <Input id="session-timeout" type="number" defaultValue="30" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-login-attempts">عدد محاولات تسجيل الدخول</Label>
                    <Input id="max-login-attempts" type="number" defaultValue="5" />
                  </div>

                  <Button>حفظ إعدادات الأمان</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
