"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"

export default function DateTimePage() {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [slots, setSlots] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const service = sessionStorage.getItem("selectedService")
    const staff = sessionStorage.getItem("selectedStaff")
    if (!service || !staff) {
      router.push("/booking/service")
    }
  }, [router])

  // وقتی تاریخ انتخاب میشه، ساعت‌های خالی رو بگیر
  useEffect(() => {
    if (!date) return

    const staffId = sessionStorage.getItem("selectedStaff")
    const serviceId = sessionStorage.getItem("selectedService")

    if (!staffId || !serviceId) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    setSelectedSlot(null)
    setSlots([])

    const dateStr = date.toISOString().split("T")[0]

    fetch(`/api/slots?staffId=${staffId}&serviceId=${serviceId}&date=${dateStr}`)
      .then((res) => res.json())
      .then((data) => {
        setSlots(data.slots || [])
        setMessage(data.message || "")
        setLoading(false)
      })
  }, [date])

  function handleNext() {
    if (!date || !selectedSlot) return

    const [hour, minute] = selectedSlot.split(":").map(Number)
    const dateTime = new Date(date)
    dateTime.setHours(hour, minute, 0, 0)

    sessionStorage.setItem("selectedDateTime", dateTime.toISOString())
    router.push("/booking/confirm")
  }

  // غیرفعال کردن روزهای گذشته
  const disabledDays = { before: new Date() }

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-lg mx-auto space-y-6">

        {/* هدر */}
        <div className="text-center pt-8">
          <h1 className="text-2xl font-bold text-gray-900">انتخاب تاریخ و ساعت</h1>
          <p className="text-gray-500 mt-1">روز و ساعت مناسب را انتخاب کنید</p>
        </div>

        {/* نشانگر مرحله */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full">✓ سرویس</span>
          <span className="text-gray-300">─────</span>
          <span className="bg-green-500 text-white px-3 py-1 rounded-full">✓ متخصص</span>
          <span className="text-gray-300">─────</span>
          <span className="bg-pink-500 text-white px-3 py-1 rounded-full">۳ زمان</span>
        </div>

        {/* تقویم */}
        <Card>
          <CardContent className="p-4 flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={disabledDays}
              className="rounded-md"
            />
          </CardContent>
        </Card>

        {/* ساعت‌های خالی */}
        {date && (
          <Card>
            <CardContent className="p-4">
              <p className="font-semibold text-gray-700 mb-3">ساعت‌های خالی:</p>

              {loading ? (
                <p className="text-gray-400 text-center">در حال بارگذاری...</p>
              ) : message ? (
                <p className="text-red-400 text-center">{message}</p>
              ) : slots.length === 0 ? (
                <p className="text-gray-400 text-center">ساعت خالی وجود ندارد</p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2 rounded-lg text-sm font-medium transition-all ${
                        selectedSlot === slot
                          ? "bg-pink-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-pink-100"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* دکمه‌ها */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/booking/staff")}
          >
            مرحله قبل
          </Button>
          <Button
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
            disabled={!date || !selectedSlot}
            onClick={handleNext}
          >
            مرحله بعد — تأیید نهایی
          </Button>
        </div>

      </div>
    </div>
  )
}