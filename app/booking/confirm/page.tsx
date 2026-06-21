"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"

interface BookingData {
  service: { id: string; name: string; price: number; duration: number }
  staff: { id: string; name: string; specialty: string }
  dateTime: string
}

export default function ConfirmPage() {
  const router = useRouter()
  const [data, setData] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

useEffect(() => {
    const serviceId = sessionStorage.getItem("selectedService")
    const staffId = sessionStorage.getItem("selectedStaff")
    const dateTime = sessionStorage.getItem("selectedDateTime")

    console.log("serviceId:", serviceId)
    console.log("staffId:", staffId)
    console.log("dateTime:", dateTime)

    if (!serviceId || !staffId || !dateTime) {
      router.push("/booking/service")
      return
    }

    Promise.all([
      fetch(`/api/services/${serviceId}`).then((r) => r.json()),
      fetch(`/api/staff/${staffId}`).then((r) => r.json()),
    ]).then(([service, staff]) => {
      console.log("service:", service)
      console.log("staff:", staff)
      setData({ service, staff, dateTime })
    })
  }, [router])

 async function handleConfirm() {
    setLoading(true)
    setError("")

    const user = JSON.parse(localStorage.getItem("user") || "{}")

    if (!user?.id) {
      sessionStorage.setItem("redirectAfterLogin", "/booking/confirm")
      router.push("/login")
      return
    }

    // مستقیم از sessionStorage بخون
    const staffId = sessionStorage.getItem("selectedStaff")
    const serviceId = sessionStorage.getItem("selectedService")
    const dateTime = sessionStorage.getItem("selectedDateTime")

    console.log("ارسالی:", { userId: user.id, serviceId, staffId, dateTime })

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        serviceId: serviceId,
        staffId: staffId,
        date: dateTime,
      }),
    })

    setLoading(false)

    if (res.ok) {
      sessionStorage.removeItem("selectedService")
      sessionStorage.removeItem("selectedStaff")
      sessionStorage.removeItem("selectedDateTime")
      router.push("/booking/success")
    } else {
      const err = await res.json()
      setError(err.error)
    }
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">در حال بارگذاری...</p>
      </div>
    )
  }

  const dateTime = new Date(data.dateTime)

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-lg mx-auto space-y-6">

        {/* هدر */}
        <div className="text-center pt-8">
          <h1 className="text-2xl font-bold text-gray-900">تأیید نهایی</h1>
          <p className="text-gray-500 mt-1">اطلاعات نوبت خود را بررسی کنید</p>
        </div>

        {/* خلاصه نوبت */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">سرویس</span>
              <span className="font-semibold">{data.service.name}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">متخصص</span>
              <span className="font-semibold">{data.staff.name}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">تاریخ</span>
              <span className="font-semibold">
                {dateTime.toLocaleDateString("fa-IR")}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">ساعت</span>
              <span className="font-semibold">
                {dateTime.toLocaleTimeString("fa-IR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">مدت زمان</span>
              <span className="font-semibold">{data.service.duration} دقیقه</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">قیمت</span>
              <span className="font-bold text-pink-500 text-lg">
                {formatPrice(data.service.price)}
              </span>
            </div>
          </CardContent>
        </Card>

        {error && (
          <p className="text-red-500 text-center text-sm">{error}</p>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/booking/datetime")}
          >
            مرحله قبل
          </Button>
          <Button
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "در حال ثبت..." : "ثبت نوبت ✓"}
          </Button>
        </div>

      </div>
    </div>
  )
}