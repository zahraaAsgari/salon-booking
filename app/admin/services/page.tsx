"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatPrice } from "@/lib/utils"

interface Service {
  id: string
  name: string
  description: string | null
  price: number
  duration: number
  isActive: boolean
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: "", description: "", price: "", duration: ""
  })

  function loadServices() {
    fetch("/api/admin/services")
      .then((r) => r.json())
      .then((data) => setServices(Array.isArray(data) ? data : []))
  }

  useEffect(() => { loadServices() }, [])

  async function handleAdd() {
    if (!form.name || !form.price || !form.duration) return
    await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: parseInt(form.price),
        duration: parseInt(form.duration),
      }),
    })
    setForm({ name: "", description: "", price: "", duration: "" })
    setShowForm(false)
    loadServices()
  }

  async function toggleActive(service: Service) {
    await fetch(`/api/admin/services/${service.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...service, isActive: !service.isActive }),
    })
    loadServices()
  }

  async function deleteService(id: string) {
    if (!confirm("آیا مطمئنید؟")) return
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" })
    loadServices()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">مدیریت سرویس‌ها</h1>
        <Button
          className="bg-pink-500 hover:bg-pink-600 text-white"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "انصراف" : "+ افزودن سرویس"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <h2 className="font-semibold">سرویس جدید</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>نام سرویس</Label>
                <Input
                  placeholder="کوتاهی مو"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>توضیحات</Label>
                <Input
                  placeholder="توضیح کوتاه"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>قیمت (تومان)</Label>
                <Input
                  placeholder="150000"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>مدت زمان (دقیقه)</Label>
                <Input
                  placeholder="45"
                  type="number"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </div>
            </div>
            <Button
              className="bg-pink-500 hover:bg-pink-600 text-white"
              onClick={handleAdd}
            >
              ذخیره
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {services.map((service) => (
          <Card key={service.id} className={!service.isActive ? "opacity-60" : ""}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{service.name}</p>
                {service.description && (
                  <p className="text-sm text-gray-500">{service.description}</p>
                )}
                <p className="text-sm text-gray-500">
                  ⏱ {service.duration} دقیقه • {formatPrice(service.price)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleActive(service)}
                >
                  {service.isActive ? "غیرفعال" : "فعال"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-500 border-red-300"
                  onClick={() => deleteService(service.id)}
                >
                  حذف
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}