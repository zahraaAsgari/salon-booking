"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

import Image from "next/image"

interface Salon {
  id: string
  name: string
  phone: string
  address: string
  description: string
  heroImage: string | null
  logo: string | null
}

interface GalleryItem {
  id: string
  url: string
  title: string
}

interface SlideItem {
  id: string
  url?: string
  title: string
  emoji?: string
  bg?: string
}
const defaultGallery: SlideItem[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1560066984-138daaa70c8f?w=800",
    title: "کوتاهی و استایل مو",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
    title: "رنگ و هایلایت",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800",
    title: "آرایش حرفه‌ای",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800",
    title: "مانیکور و پدیکور",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800",
    title: "خدمات تخصصی",
  },
]

const steps = [
  { title: "انتخاب سرویس", desc: "سرویس مورد نظر را انتخاب کنید", icon: "✂️" },
  { title: "انتخاب متخصص", desc: "با متخصص دلخواه نوبت بگیرید", icon: "👩" },
  { title: "انتخاب زمان", desc: "روز و ساعت مناسب را انتخاب کنید", icon: "📅" },
  { title: "تأیید نوبت", desc: "نوبت شما ثبت و تأیید می‌شود", icon: "✅" },
]

export default function HomePage() {
  const [salon, setSalon] = useState<Salon | null>(null)
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides: SlideItem[] = gallery.length > 0
    ? gallery.map((g) => ({ id: g.id, url: g.url, title: g.title }))
    : defaultGallery

  useEffect(() => {
 fetch("/api/salon?slug=default")
      .then((r) => r.json())
      .then((data) => {
        setSalon(data)
        fetch(`/api/gallery?salonId=${data.id}`)
          .then((r) => r.json())
          .then((g) => setGallery(Array.isArray(g) ? g : []))
      })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <main className="min-h-screen bg-white" dir="rtl">

      {/* هیرو */}
     <section
  className="relative py-40 px-4 overflow-hidden"
  style={{
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${
      salon?.heroImage ||
      "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=1200"
    })`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  </section>

      {/* کروسل */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            نمونه کارهای ما
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            بهترین خدمات زیبایی با متخصصان مجرب
          </p>

          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(${currentSlide * 100}%)` }}
            >
              {slides.map((item: SlideItem) => (
                <div key={item.id} className="min-w-full relative">
                  {item.url ? (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-64 ${item.bg} flex flex-col items-center justify-center`}
                    >
                      <div className="text-8xl mb-4">{item.emoji}</div>
                      <p className="text-2xl font-bold text-gray-700">{item.title}</p>
                    </div>
                  )}
                  {item.title && item.url && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="text-white font-semibold">{item.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur rounded-full w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-white shadow-md text-xl"
            >
              ›
            </button>
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % slides.length)
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur rounded-full w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-white shadow-md text-xl"
            >
              ‹
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`rounded-full transition-all ${
                    i === currentSlide ? "bg-white w-4 h-2" : "bg-white/50 w-2 h-2"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* گالری */}
      {gallery.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              گالری کارها
            </h2>
            <div className="columns-2 md:columns-3 gap-3 space-y-3">
              {gallery.map((item, i) => (
                <div key={item.id} className="break-inside-avoid">
                  <Image
                    src={item.url}
                    alt={item.title}
                    width={800}
                    height={224}
                    className={`w-full rounded-2xl object-cover shadow-sm hover:shadow-md transition-all ${
                      i % 3 === 0 ? "h-48" : i % 3 === 1 ? "h-36" : "h-56"
                    }`}
                  />
                  {item.title && (
                    <p className="text-xs text-center text-gray-500 mt-1">
                      {item.title}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* مراحل */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
            رزرو نوبت در ۴ قدم
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="text-center space-y-3">
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
      {salon && (salon.phone || salon.address) && (
        <section className="py-12 px-4 bg-white">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              تماس با ما
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {salon.phone && (
                <div className="bg-pink-50 rounded-2xl p-4 flex items-center gap-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="text-xs text-gray-500">تلفن</p>
                    <p className="font-bold text-gray-900">{salon.phone}</p>
                  </div>
                </div>
              )}
              {salon.address && (
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
      )}

      {/* CTA */}
      <section className="py-16 px-4 bg-linear-to-r from-pink-500 to-purple-500 text-white text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold">همین الان نوبت بگیرید!</h2>
          <p className="text-pink-100">بدون تماس تلفنی، آنلاین و سریع</p>
          <Link href="/booking/service">
            <Button
              size="lg"
              className="bg-white text-pink-500 hover:bg-pink-50 px-8 mt-2"
            >
              رزرو نوبت رایگان ←
            </Button>
          </Link>
        </div>
      </section>

      {/* فوتر */}
      <footer className="py-8 px-4 text-center text-sm text-gray-400 border-t">
        <p>{salon?.name || "سالن زیبایی نیلوفر"} © ۱۴۰۵</p>
      </footer>
    </main>
  )
}