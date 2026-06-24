"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  { href: "/admin/dashboard", label: "داشبورد", icon: "📊" },
  { href: "/admin/appointments", label: "نوبت‌ها", icon: "📅" },
  { href: "/admin/services", label: "سرویس‌ها", icon: "✂️" },
  { href: "/admin/staff", label: "متخصصان", icon: "👩" },
  { href: "/admin/settings", label: "تنظیمات سالن", icon: "⚙️" }, 
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-100 flex" dir="rtl">
      {/* سایدبار */}
      <aside className="w-56 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b">
          <h1 className="font-bold text-gray-900 text-lg">💅 پنل ادمین</h1>
          <p className="text-xs text-gray-500">سالن زیبایی نیلوفر</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                pathname === item.href
                  ? "bg-pink-500 text-white"
                  : "text-gray-600 hover:bg-pink-50"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <span>🏠</span>
            <span>بازگشت به سایت</span>
          </Link>
        </div>
      </aside>

      {/* محتوا */}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}