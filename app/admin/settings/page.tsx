"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Salon {
  id: string
  name: string
  phone: string
  address: string
  description: string
  logo: string | null
  heroImage: string | null
}

export default function SettingsPage() {
  const [salon, setSalon] = useState<Salon | null>(null)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    description: "",
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [heroFile, setHeroFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch("/api/salon?slug=niloofar")
      .then((r) => r.json())
      .then((data) => {
        setSalon(data)
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          address: data.address || "",
          description: data.description || "",
        })
      })
  }, [])

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
    const data = await res.json()
    return data.url
  }

  async function handleSave() {
    if (!salon) return
    setLoading(true)
    setSuccess(false)

    let logo = salon.logo
    let heroImage = salon.heroImage

    if (logoFile) logo = await uploadImage(logoFile)
    if (heroFile) heroImage = await uploadImage(heroFile)

    await fetch("/api/salon", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        salonId: salon.id,
        ...form,
        logo,
        heroImage,
      }),
    })

    setLoading(false)
    setSuccess(true)
  }

  if (!salon) return null

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-900">تنظیمات سالن</h1>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-semibold text-gray-700 border-b pb-2">اطلاعات پایه</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>نام سالن</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>شماره تماس</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="space-y-1 col-span-2">
              <Label>آدرس</Label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="space-y-1 col-span-2">
              <Label>توضیحات</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-semibold text-gray-700 border-b pb-2">تصاویر</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>لوگو سالن</Label>
              {salon.logo && (
                <img src={salon.logo} alt="logo" className="w-20 h-20 rounded-lg object-cover" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label>عکس هیرو (صفحه اصلی)</Label>
              {salon.heroImage && (
                <img src={salon.heroImage} alt="hero" className="w-full h-20 rounded-lg object-cover" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                className="text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {success && (
        <p className="text-green-500 text-center">✅ تنظیمات ذخیره شد</p>
      )}

      <Button
        className="w-full bg-pink-500 hover:bg-pink-600 text-white"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "در حال ذخیره..." : "ذخیره تنظیمات"}
      </Button>
    </div>
  )
}