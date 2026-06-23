"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import Loading from "@/components/Loading"


interface Service {
  id: string
  name: string
  price: number
  duration: number
}

interface Staff {
  id: string
  name: string
  specialty: string
}

export default function ConfirmPage() {
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [staff, setStaff] = useState<Staff | null>(null)
  const [dateTime, setDateTime] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const serviceId = sessionStorage.getItem("selectedService")
    const staffId = sessionStorage.getItem("selectedStaff")
    const dt = sessionStorage.getItem("selectedDateTime")

    if (!serviceId || !staffId || !dt) {
      router.push("/booking/service")
      return
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDateTime(dt)

    Promise.all([
      fetch(`/api/services/${serviceId}`).then((r) => r.json()),
      fetch(`/api/staff/${staffId}`).then((r) => r.json()),
    ]).then(([s, st]) => {
      setService(s)
      setStaff(st)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [router])

  async function handleConfirm() {
    setSubmitting(true)
    setError("")

    const user = JSON.parse(localStorage.getItem("user") || "{}")

    if (!user?.id) {
      sessionStorage.setItem("redirectAfterLogin", "/booking/confirm")
      router.push("/login")
      return
    }

    const staffId = sessionStorage.getItem("selectedStaff")
    const serviceId = sessionStorage.getItem("selectedService")
    const dt = sessionStorage.getItem("selectedDateTime")

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        serviceId,
        staffId,
        date: dt,
      }),
    })

    setSubmitting(false)

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (!service || !staff || !dateTime) return null

  const date = new Date(dateTime)

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-lg mx-auto space-y-6">

        <div className="text-center pt-8">
          <h1 className="text-2xl font-bold text-gray-900">تأیید نهایی</h1>
          <p className="text-gray-500 mt-1">اطلاعات نوبت خود را بررسی کنید</p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">سرویس</span>
              <span className="font-semibold">{service.name}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">متخصص</span>
              <span className="font-semibold">{staff.name}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">تخصص</span>
              <span className="font-semibold">{staff.specialty}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">تاریخ</span>
              <span className="font-semibold">
                {date.toLocaleDateString("fa-IR")}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">ساعت</span>
              <span className="font-semibold">
                {date.toLocaleTimeString("fa-IR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">مدت زمان</span>
              <span className="font-semibold">{service.duration} دقیقه</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">قیمت</span>
              <span className="font-bold text-pink-500 text-lg">
                {formatPrice(service.price)}
              </span>
            </div>
          </CardContent>
        </Card>

        {error && (
          <p className="text-red-500 text-center text-sm">{error}</p>
        )}

        <div className="flex gap-3 pb-6">
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
            disabled={submitting}
          >
            {submitting ? "در حال ثبت..." : "ثبت نوبت ✓"}
          </Button>
        </div>

      </div>
    </div>
  )
}