"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import moment from "moment-jalaali"
import TimeSlots from "@/components/booking/time-slots"
import PersianCalendar from "@/components/booking/Calendar"

moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true })

export default function DateTimePage() {
  const router = useRouter()
  const [date, setDate] = useState<Date | null>(null)
  const [slots, setSlots] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const service = sessionStorage.getItem("selectedService")
    const staff = sessionStorage.getItem("selectedStaff")
    if (!service || !staff) {
      router.push("/booking/service")
    }
  }, [router])

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
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [date])

  function handleNext() {
    if (!date || !selectedSlot) return
    const [hour, minute] = selectedSlot.split(":").map(Number)
    const dateTime = new Date(date)
    dateTime.setHours(hour, minute, 0, 0)
    sessionStorage.setItem("selectedDateTime", dateTime.toISOString())
    router.push("/booking/confirm")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-lg mx-auto space-y-4 pt-6">

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">انتخاب تاریخ و ساعت</h1>
          <p className="text-gray-500 mt-1 text-sm">روز و ساعت مناسب را انتخاب کنید</p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full">✓ سرویس</span>
          <span className="text-gray-300">───</span>
          <span className="bg-green-500 text-white px-3 py-1 rounded-full">✓ متخصص</span>
          <span className="text-gray-300">───</span>
          <span className="bg-pink-500 text-white px-3 py-1 rounded-full">۳ زمان</span>
        </div>

        {date && (
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-3 text-center">
            <p className="text-pink-600 font-medium text-sm">
              📅 {moment(date).format("dddd jD jMMMM jYYYY")}
            </p>
          </div>
        )}

        <PersianCalendar
          onSelectDate={(d) => setDate(d)}
          selectedDate={date}
        />

        {date && (
          <TimeSlots
            slots={slots}
            selected={selectedSlot}
            loading={loading}
            onSelect={setSelectedSlot}
          />
        )}

        <div className="flex gap-3 pb-6">
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
            مرحله بعد ←
          </Button>
        </div>

      </div>
    </div>
  )
}