"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface Salon {
  id: string
  name: string
  phone: string
  address: string
  description: string
  logo: string | null
  heroImage: string | null
}

interface GalleryItem {
  id: string
  url: string
  title: string
}

export default function SettingsPage() {
  const [salon, setSalon] = useState<Salon | null>(null)
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [form, setForm] = useState({
    name: "", phone: "", address: "", description: "",
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [heroFile, setHeroFile] = useState<File | null>(null)
  const [galleryFile, setGalleryFile] = useState<File | null>(null)
  const [galleryTitle, setGalleryTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [success, setSuccess] = useState(false)

  // اول تابع رو تعریف کن
  function loadGallery(salonId: string) {
    fetch(`/api/gallery?salonId=${salonId}`)
      .then((r) => r.json())
      .then((data) => setGallery(Array.isArray(data) ? data : []))
  }

  // بعد توی useEffect صداش بزن
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
        loadGallery(data.id)
      })
  }, [])

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch("/api/upload", { method: "POST", body: formData })
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
      body: JSON.stringify({ salonId: salon.id, ...form, logo, heroImage }),
    })

    setLoading(false)
    setSuccess(true)
  }

  async function handleAddGallery() {
    if (!galleryFile || !salon) return
    setUploadingGallery(true)

    const url = await uploadImage(galleryFile)
    await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        salonId: salon.id,
        url,
        title: galleryTitle,
        order: gallery.length,
      }),
    })

    setGalleryFile(null)
    setGalleryTitle("")
    setUploadingGallery(false)
    loadGallery(salon.id)
  }

  async function handleDeleteGallery(id: string) {
    await fetch(`/api/gallery?id=${id}`, { method: "DELETE" })
    if (salon) loadGallery(salon.id)
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
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>شماره تماس</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-1 col-span-2">
              <Label>آدرس</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="space-y-1 col-span-2">
              <Label>توضیحات</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-semibold text-gray-700 border-b pb-2">تصاویر اصلی</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>لوگو سالن</Label>
              {salon.logo && (
                <Image src={salon.logo} alt="logo" className="w-20 h-20 rounded-xl object-cover border" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                className="text-sm w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>عکس هیرو</Label>
              {salon.heroImage && (
                <Image src={salon.heroImage} alt="hero" className="w-full h-20 rounded-xl object-cover border" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                className="text-sm w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {success && <p className="text-green-500 text-center font-medium">✅ تنظیمات ذخیره شد</p>}

      <Button
        className="w-full bg-pink-500 hover:bg-pink-600 text-white"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "در حال ذخیره..." : "ذخیره تنظیمات"}
      </Button>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-semibold text-gray-700 border-b pb-2">گالری نمونه کارها</h2>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <p className="text-sm font-medium text-gray-600">افزودن عکس جدید</p>
            <Input
              placeholder="عنوان عکس (مثلاً: رنگ و هایلایت)"
              value={galleryTitle}
              onChange={(e) => setGalleryTitle(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setGalleryFile(e.target.files?.[0] || null)}
              className="text-sm w-full"
            />
            <Button
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
              onClick={handleAddGallery}
              disabled={uploadingGallery || !galleryFile}
            >
              {uploadingGallery ? "در حال آپلود..." : "افزودن به گالری"}
            </Button>
          </div>

          {gallery.length === 0 ? (
            <p className="text-center text-gray-400 py-4">هنوز عکسی اضافه نشده</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {gallery.map((item) => (
                <div key={item.id} className="relative group">
                  <Image
                    src={item.url}
                    alt={item.title}
                    className="w-full h-24 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-xl transition-all flex items-center justify-center">
                    <button
                      onClick={() => handleDeleteGallery(item.id)}
                      className="opacity-0 group-hover:opacity-100 bg-red-500 text-white text-xs px-2 py-1 rounded-lg"
                    >
                      حذف
                    </button>
                  </div>
                  {item.title && (
                    <p className="text-xs text-center text-gray-500 mt-1 truncate">{item.title}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}