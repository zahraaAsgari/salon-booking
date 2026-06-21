"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"

interface Service {
  id: string
  name: string
  description: string | null
  price: number
  duration: number
}

export default function ServicePage() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(data)
        setLoading(false)
      })
  }, [])

  function handleNext() {
    if (!selected) return
    // ذخیره انتخاب توی sessionStorage
    sessionStorage.setItem("selectedService", selected)
    router.push("/booking/staff")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">در حال بارگذاری...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-lg mx-auto space-y-6">

        {/* هدر */}
        <div className="text-center pt-8">
          <h1 className="text-2xl font-bold text-gray-900">انتخاب سرویس</h1>
          <p className="text-gray-500 mt-1">سرویس مورد نظر خود را انتخاب کنید</p>
        </div>

        {/* نشانگر مرحله */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="bg-pink-500 text-white px-3 py-1 rounded-full">۱ سرویس</span>
          <span className="text-gray-300">─────</span>
          <span className="bg-gray-200 text-gray-500 px-3 py-1 rounded-full">۲ متخصص</span>
          <span className="text-gray-300">─────</span>
          <span className="bg-gray-200 text-gray-500 px-3 py-1 rounded-full">۳ زمان</span>
        </div>

        {/* لیست سرویس‌ها */}
        {services.length === 0 ? (
          <p className="text-center text-gray-500">سرویسی یافت نشد</p>
        ) : (
          <div className="space-y-3">
            {services.map((service) => (
              <Card
                key={service.id}
                className={`cursor-pointer transition-all border-2 ${
                  selected === service.id
                    ? "border-pink-500 bg-pink-50"
                    : "border-transparent hover:border-pink-200"
                }`}
                onClick={() => setSelected(service.id)}
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">{service.name}</p>
                    {service.description && (
                      <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                    )}
                    <p className="text-sm text-gray-400 mt-1">
                      ⏱ {service.duration} دقیقه
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-pink-500">
                      {formatPrice(service.price)}
                    </p>
                    {selected === service.id && (
                      <span className="text-pink-500 text-xl">✓</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Button
          className="w-full bg-pink-500 hover:bg-pink-600 text-white"
          disabled={!selected}
          onClick={handleNext}
        >
          مرحله بعد — انتخاب متخصص
        </Button>

      </div>
    </div>
  )
}