"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Staff {
  id: string
  name: string
  specialty: string
}

export default function StaffPage() {
  const router = useRouter()
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)

useEffect(() => {
    const service = sessionStorage.getItem("selectedService")
    if (!service) {
      router.push("/booking/service")
      return
    }

    // serviceId رو به API بفرست
    fetch(`/api/staff?serviceId=${service}`)
      .then((res) => res.json())
      .then((data) => {
        setStaffList(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setStaffList([])
        setLoading(false)
      })
  }, [router])

  function handleNext() {
    if (!selected) return
    sessionStorage.setItem("selectedStaff", selected)
    router.push("/booking/datetime")
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

        <div className="text-center pt-8">
          <h1 className="text-2xl font-bold text-gray-900">انتخاب متخصص</h1>
          <p className="text-gray-500 mt-1">متخصص مورد نظر خود را انتخاب کنید</p>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full">✓ سرویس</span>
          <span className="text-gray-300">─────</span>
          <span className="bg-pink-500 text-white px-3 py-1 rounded-full">۲ متخصص</span>
          <span className="text-gray-300">─────</span>
          <span className="bg-gray-200 text-gray-500 px-3 py-1 rounded-full">۳ زمان</span>
        </div>

        <div className="space-y-3">
          {staffList.length === 0 ? (
            <p className="text-center text-gray-500">متخصصی یافت نشد</p>
          ) : (
            staffList.map((staff) => (
              <Card
                key={staff.id}
                className={`cursor-pointer transition-all border-2 ${
                  selected === staff.id
                    ? "border-pink-500 bg-pink-50"
                    : "border-transparent hover:border-pink-200"
                }`}
                onClick={() => setSelected(staff.id)}
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-xl">
                      👩
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{staff.name}</p>
                      <p className="text-sm text-gray-500">{staff.specialty}</p>
                    </div>
                  </div>
                  {selected === staff.id && (
                    <span className="text-pink-500 text-xl">✓</span>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/booking/service")}
          >
            مرحله قبل
          </Button>
          <Button
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
            disabled={!selected}
            onClick={handleNext}
          >
            مرحله بعد — انتخاب زمان
          </Button>
        </div>

      </div>
    </div>
  )
}