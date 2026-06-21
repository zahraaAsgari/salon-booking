"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Staff {
  id: string
  name: string
  specialty: string
  phone: string | null
  isActive: boolean
}

export default function StaffAdminPage() {
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", specialty: "", phone: "" })

  function loadStaff() {
    fetch("/api/admin/staff")
      .then((r) => r.json())
      .then((data) => setStaffList(Array.isArray(data) ? data : []))
  }

  useEffect(() => { loadStaff() }, [])

  async function handleAdd() {
    if (!form.name || !form.specialty) return
    await fetch("/api/admin/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setForm({ name: "", specialty: "", phone: "" })
    setShowForm(false)
    loadStaff()
  }

  async function toggleActive(staff: Staff) {
    await fetch(`/api/admin/staff/${staff.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...staff, isActive: !staff.isActive }),
    })
    loadStaff()
  }

  async function deleteStaff(id: string) {
    if (!confirm("آیا مطمئنید؟")) return
    await fetch(`/api/admin/staff/${id}`, { method: "DELETE" })
    loadStaff()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">مدیریت متخصصان</h1>
        <Button
          className="bg-pink-500 hover:bg-pink-600 text-white"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "انصراف" : "+ افزودن متخصص"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <h2 className="font-semibold">متخصص جدید</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>نام</Label>
                <Input
                  placeholder="خانم احمدی"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>تخصص</Label>
                <Input
                  placeholder="کوتاهی و رنگ"
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>شماره موبایل (اختیاری)</Label>
                <Input
                  placeholder="09123456789"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
        {staffList.map((staff) => (
          <Card key={staff.id} className={!staff.isActive ? "opacity-60" : ""}>
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                  👩
                </div>
                <div>
                  <p className="font-semibold">{staff.name}</p>
                  <p className="text-sm text-gray-500">{staff.specialty}</p>
                  {staff.phone && (
                    <p className="text-sm text-gray-400">{staff.phone}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleActive(staff)}
                >
                  {staff.isActive ? "غیرفعال" : "فعال"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-500 border-red-300"
                  onClick={() => deleteStaff(staff.id)}
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