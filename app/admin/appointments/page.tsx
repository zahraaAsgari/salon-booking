"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

interface Appointment {
  id: string
  date: string
  status: string
  totalPrice: number
  user_phone: string
  user_name: string | null
  service_name: string
  service_duration: number
  staff_name: string
  notes: string | null
}

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "در انتظار", color: "bg-yellow-100 text-yellow-700" },
  CONFIRMED: { label: "تأیید شده", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "لغو شده", color: "bg-red-100 text-red-700" },
  COMPLETED: { label: "انجام شده", color: "bg-blue-100 text-blue-700" },
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filter, setFilter] = useState("")
  const [loading, setLoading] = useState(true)

  function loadAppointments(status = "") {
    setLoading(true)
    fetch(`/api/admin/appointments${status ? `?status=${status}` : ""}`)
      .then((r) => r.json())
      .then((data) => {
        setAppointments(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAppointments()
  }, [])

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    loadAppointments(filter)
  }

  async function deleteAppointment(id: string) {
    if (!confirm("آیا مطمئنید؟")) return
    await fetch(`/api/admin/appointments/${id}`, { method: "DELETE" })
    loadAppointments(filter)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">مدیریت نوبت‌ها</h1>

      {/* فیلتر */}
      <div className="flex gap-2 flex-wrap">
        {["", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((s) => (
          <Button
            key={s}
            size="sm"
            variant={filter === s ? "default" : "outline"}
            className={filter === s ? "bg-pink-500 text-white" : ""}
            onClick={() => {
              setFilter(s)
              loadAppointments(s)
            }}
          >
            {s === "" ? "همه" : statusMap[s]?.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">در حال بارگذاری...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500">نوبتی یافت نشد</p>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => (
            <Card key={apt.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{apt.service_name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusMap[apt.status]?.color}`}>
                        {statusMap[apt.status]?.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      👩 {apt.staff_name} • ⏱ {apt.service_duration} دقیقه
                    </p>
                    <p className="text-sm text-gray-500">
                      📱 {apt.user_phone} {apt.user_name ? `• ${apt.user_name}` : ""}
                    </p>
                    <p className="text-sm text-gray-500">
                      🗓 {new Date(apt.date).toLocaleDateString("fa-IR")} ساعت{" "}
                      {new Date(apt.date).toLocaleTimeString("fa-IR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm font-medium text-pink-500">
                      {formatPrice(apt.totalPrice)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {apt.status === "PENDING" && (
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => updateStatus(apt.id, "CONFIRMED")}
                      >
                        تأیید
                      </Button>
                    )}
                    {apt.status === "CONFIRMED" && (
                      <Button
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => updateStatus(apt.id, "COMPLETED")}
                      >
                        انجام شد
                      </Button>
                    )}
                    {apt.status !== "CANCELLED" && apt.status !== "COMPLETED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 border-red-300"
                        onClick={() => updateStatus(apt.id, "CANCELLED")}
                      >
                        لغو
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-gray-500"
                      onClick={() => deleteAppointment(apt.id)}
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}