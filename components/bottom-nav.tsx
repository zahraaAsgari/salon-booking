"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface User {
  id: string
  role?: string
}

export default function BottomNav() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(stored ? JSON.parse(stored) : null)
    setMounted(true)
  }, [pathname])

  // توی پنل ادمین نشون نده
  if (pathname?.startsWith("/admin")) return null
  if (!mounted) return null

  const items = [
    {
      href: "/",
      icon: "🏠",
      label: "خانه",
    },
    {
      href: "/booking/service",
      icon: "📅",
      label: "رزرو",
    },
    {
      href: user ? "/profile" : "/login",
      icon: user ? "👤" : "🔑",
      label: user ? "پروفایل" : "ورود",
    },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="flex justify-around items-center py-2">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
                isActive
                  ? "text-pink-500"
                  : "text-gray-400 hover:text-pink-400"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-pink-500" />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}