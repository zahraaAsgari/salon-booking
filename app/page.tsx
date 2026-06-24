"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import HomeButtons from "@/components/home-buttons"


interface Salon {
  id: string
  name: string
  slug: string
  phone: string
  address: string
  description: string
  heroImage: string | null
  logo: string | null
}

// نمونه کارها — بعداً از دیتابیس میاد
const gallery = [
  { id: 1, title: "کوتاهی مو", emoji: "✂️", bg: "bg-pink-100" },
  { id: 2, title: "رنگ و هایلایت", emoji: "🎨", bg: "bg-purple-100" },
  { id: 3, title: "مانیکور", emoji: "💅", bg: "bg-rose-100" },
  { id: 4, title: "پدیکور", emoji: "🦶", bg: "bg-orange-100" },
  { id: 5, title: "کراتین", emoji: "✨", bg: "bg-yellow-100" },
  { id: 6, title: "هایلایت", emoji: "🌟", bg: "bg-amber-100" },
]

const steps = [
  { step: "۱", title: "انتخاب سرویس", desc: "سرویس مورد نظر را انتخاب کنید", icon: "✂️" },
  { step: "۲", title: "انتخاب متخصص", desc: "با متخصص دلخواه نوبت بگیرید", icon: "👩" },
  { step: "۳", title: "انتخاب زمان", desc: "روز و ساعت مناسب را انتخاب کنید", icon: "📅" },
  { step: "۴", title: "تأیید نوبت", desc: "نوبت شما ثبت و تأیید می‌شود", icon: "✅" },
]

export default function HomePage() {
  const [salon, setSalon] = useState<Salon | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    fetch("/api/salon?slug=niloofar")
      .then((r) => r.json())
      .then((data) => setSalon(data))
  }, [])

  // کروسل اتوماتیک
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % gallery.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <main className="min-h-screen bg-white" dir="rtl">

      {/* هیرو */}
      <section className="relative bg-linear-to-br from-pink-500 via-pink-400 to-purple-500 text-white py-24 px-4 overflow-hidden">
        {/* دایره‌های تزئینی */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24" />

        <div className="max-w-2xl mx-auto text-center space-y-6 relative z-10">
          <div className="text-7xl">💅</div>
          <h1 className="text-4xl md:text-5xl font-bold">
            {salon?.name || "سالن زیبایی نیلوفر"}
          </h1>
          <p className="text-lg text-pink-100">
            {salon?.description || "رزرو آنلاین نوبت — سریع، ساده و بدون معطلی"}
          </p>
          {salon?.address && (
            <p className="text-sm text-pink-200">
              📍 {salon.address}
            </p>
          )}
          <HomeButtons />
        </div>
      </section>

      {/* کروسل نمونه کارها */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">نمونه کارهای ما</h2>
          <p className="text-center text-gray-500 mb-8 text-sm">بهترین خدمات زیبایی با متخصصان مجرب</p>

          {/* کروسل */}
          <div className="relative overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(${currentSlide * 100}%)` }}
            >
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className={`min-w-full h-48 ${item.bg} flex flex-col items-center justify-center rounded-2xl`}
                >
                  <div className="text-7xl mb-4">{item.emoji}</div>
                  <p className="text-xl font-bold text-gray-700">{item.title}</p>
                </div>
              ))}
            </div>

            {/* دکمه‌های کروسل */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + gallery.length) % gallery.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-pink-50"
            >
              ›
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % gallery.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-pink-50"
            >
              ‹
            </button>

            {/* نقاط */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {gallery.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentSlide ? "bg-pink-500 w-4" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* گالری */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">خدمات ما</h2>
          <p className="text-center text-gray-500 mb-8 text-sm">انواع خدمات زیبایی حرفه‌ای</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((item) => (
              <Link href="/booking/service" key={item.id}>
                <div className={`${item.bg} rounded-2xl p-6 text-center hover:scale-105 transition-all cursor-pointer`}>
                  <div className="text-4xl mb-3">{item.emoji}</div>
                  <p className="font-semibold text-gray-800">{item.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* مراحل رزرو */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">رزرو نوبت در ۴ قدم</h2>
          <p className="text-center text-gray-500 mb-10 text-sm">سریع و آسان نوبت بگیرید</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.step} className="text-center space-y-3">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-pink-500 text-white flex items-center justify-center text-2xl mx-auto shadow-md">
                    {s.icon}
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-bold">
                    {i + 1}
                  </div>
                </div>
                <p className="font-bold text-gray-900">{s.title}</p>
                <p className="text-xs text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* تماس */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">تماس با ما</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {salon?.phone && (
              <div className="bg-pink-50 rounded-2xl p-4 flex items-center gap-3">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="text-xs text-gray-500">تلفن</p>
                  <p className="font-bold text-gray-900">{salon.phone}</p>
                </div>
              </div>
            )}
            {salon?.address && (
              <div className="bg-purple-50 rounded-2xl p-4 flex items-center gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="text-xs text-gray-500">آدرس</p>
                  <p className="font-bold text-gray-900">{salon.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold">همین الان نوبت بگیرید!</h2>
          <p className="text-pink-100">بدون تماس تلفنی، آنلاین و سریع</p>
          <Link href="/booking/service">
            <Button size="lg" className="bg-white text-pink-500 hover:bg-pink-50 px-8 mt-2">
              رزرو نوبت رایگان ←
            </Button>
          </Link>
        </div>
      </section>

      {/* فوتر */}
      <footer className="py-8 px-4 text-center text-sm text-gray-400 border-t">
        <p>{salon?.name || "سالن زیبایی نیلوفر"} © ۱۴۰۵ — تمام حقوق محفوظ است</p>
      </footer>

    </main>
  )
}