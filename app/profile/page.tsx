"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatPrice } from "@/lib/utils"

interface User {
  id: string
  phone: string
  name: string | null
}

interface Appointment {
  id: string
  date: string
  status: string
  totalPrice: number
  service_name: string
  service_duration: number
  staff_name: string
  notes: string | null
}

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "در انتظار تأیید", color: "bg-yellow-100 text-yellow-700" },
  CONFIRMED: { label: "تأیید شده", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "لغو شده", color: "bg-red-100 text-red-700" },
  COMPLETED: { label: "انجام شده", color: "bg-blue-100 text-blue-700" },
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming")
  const [editName, setEditName] = useState(false)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (!stored) {
      router.push("/login")
      return
    }

    const storedUser = JSON.parse(stored)

    // گرفتن اطلاعات کاربر
    fetch(`/api/profile?userId=${storedUser.id}`)
      .then((r) => r.json())
      .then((data) => {
        setUser(data)
        setName(data.name || "")
      })

    // گرفتن نوبت‌ها
    fetch(`/api/profile/appointments?userId=${storedUser.id}`)
      .then((r) => r.json())
      .then((data) => {
        setAppointments(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [router])

  async function handleUpdateName() {
    if (!user) return
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, name }),
    })
    const updated = await res.json()
    setUser(updated)
    localStorage.setItem("user", JSON.stringify(updated))
    setEditName(false)
  }

  async function handleCancel(id: string) {
    if (!confirm("آیا مطمئنید که می‌خواهید نوبت را لغو کنید؟")) return

    const res = await fetch(`/api/profile/appointments/${id}/cancel`, {
      method: "PATCH",
    })

    if (res.ok) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "CANCELLED" } : a))
      )
    } else {
      const err = await res.json()
      alert(err.error)
    }
  }

  function handleLogout() {
    localStorage.removeItem("user")
    router.push("/")
  }

  // جداسازی نوبت‌های آینده و گذشته
  const now = new Date()
  const upcoming = appointments.filter(
    (a) => new Date(a.date) >= now && a.status !== "CANCELLED"
  )
  const history = appointments.filter(
    (a) => new Date(a.date) < now || a.status === "CANCELLED"
  )

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-lg mx-auto space-y-6">

        {/* هدر */}
        <div className="flex justify-between items-center pt-6">
          <Link href="/" className="text-gray-500 text-sm">
            🏠 خانه
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 border-red-300"
            onClick={handleLogout}
          >
            خروج
          </Button>
        </div>

        {/* اطلاعات کاربر */}
        <Card>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center text-2xl">
                👤
              </div>
              <div>
                <p className="font-bold text-lg">
                  {user.name || "کاربر عزیز"}
                </p>
                <p className="text-gray-500 text-sm">{user.phone}</p>
              </div>
            </div>

            {editName ? (
              <div className="space-y-2">
                <Label>نام و نام خانوادگی</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="نام خود را وارد کنید"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                    onClick={handleUpdateName}
                  >
                    ذخیره
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditName(false)}
                  >
                    انصراف
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditName(true)}
              >
                ویرایش پروفایل
              </Button>
            )}
          </CardContent>
        </Card>

        {/* دکمه رزرو جدید */}
        <Link href="/booking/service">
          <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
            + رزرو نوبت جدید
          </Button>
        </Link>

        {/* تب‌ها */}
        <div className="flex gap-2">
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "upcoming"
                ? "bg-pink-500 text-white"
                : "bg-white text-gray-600"
            }`}
            onClick={() => setTab("upcoming")}
          >
            نوبت‌های آینده ({upcoming.length})
          </button>
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "history"
                ? "bg-pink-500 text-white"
                : "bg-white text-gray-600"
            }`}
            onClick={() => setTab("history")}
          >
            تاریخچه ({history.length})
          </button>
        </div>

        {/* لیست نوبت‌ها */}
        {loading ? (
          <p className="text-center text-gray-500">در حال بارگذاری...</p>
        ) : (
          <div className="space-y-3">
            {(tab === "upcoming" ? upcoming : history).length === 0 ? (
              <p className="text-center text-gray-400 py-8">
                {tab === "upcoming" ? "نوبت آینده‌ای ندارید" : "تاریخچه‌ای وجود ندارد"}
              </p>
            ) : (
              (tab === "upcoming" ? upcoming : history).map((apt) => (
                <Card key={apt.id}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{apt.service_name}</p>
                        <p className="text-sm text-gray-500">
                          👩 {apt.staff_name} • ⏱ {apt.service_duration} دقیقه
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
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${statusMap[apt.status]?.color}`}
                      >
                        {statusMap[apt.status]?.label}
                      </span>
                    </div>

                    {tab === "upcoming" &&
                      apt.status !== "CANCELLED" &&
                      apt.status !== "COMPLETED" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 border-red-300 w-full"
                          onClick={() => handleCancel(apt.id)}
                        >
                          لغو نوبت
                        </Button>
                      )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  )
}