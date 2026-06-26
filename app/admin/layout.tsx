"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const menuItems = [
  { href: "/admin/dashboard", label: "داشبورد", icon: "📊" },
  { href: "/admin/appointments", label: "نوبت‌ها", icon: "📅" },
  { href: "/admin/services", label: "سرویس‌ها", icon: "✂️" },
  { href: "/admin/staff", label: "متخصصان", icon: "👩" },
  { href: "/admin/settings", label: "تنظیمات", icon: "⚙️" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">

      {/* هدر موبایل */}
      <div className="md:hidden bg-white border-b px-4 py-3 flex justify-between items-center sticky top-0 z-50">
        <h1 className="font-bold text-gray-900">💅 پنل ادمین</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* overlay موبایل */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* سایدبار */}
        <aside className={`
          fixed md:sticky top-0 md:top-0 h-screen w-56 bg-white shadow-md flex flex-col z-50
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        `}>
          <div className="p-4 border-b hidden md:block">
            <h1 className="font-bold text-gray-900 text-lg">💅 پنل ادمین</h1>
            <p className="text-xs text-gray-500">سالن زیبایی نیلوفر</p>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  pathname === item.href
                    ? "bg-pink-500 text-white"
                    : "text-gray-600 hover:bg-pink-50"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-3 border-t">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 px-3 py-2"
            >
              <span>🏠</span>
              <span>بازگشت به سایت</span>
            </Link>
          </div>
        </aside>

        {/* محتوا */}
        <main className="flex-1 p-4 md:p-6 overflow-auto min-h-screen">
          {children}
        </main>
      </div>

      {/* منوی پایین موبایل برای ادمین */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="flex justify-around py-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg ${
                pathname === item.href ? "text-pink-500" : "text-gray-400"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}