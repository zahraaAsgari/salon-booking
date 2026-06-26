"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

interface User {
  id: string
  phone: string
  name?: string
  role?: string
}

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [salonName, setSalonName] = useState("سالن نیلوفر")
const [salonLogo, setSalonLogo] = useState<string | null>(null)

useEffect(() => {
  fetch("/api/salon?slug=niloofar")
    .then((r) => r.json())
    .then((data) => {
      if (data.name) setSalonName(data.name)
      if (data.logo) setSalonLogo(data.logo)
    })
}, [])

  useEffect(() => {
    const stored = localStorage.getItem("user")
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(stored ? JSON.parse(stored) : null)
    setMounted(true)
  }, [pathname])

  function handleLogout() {
    localStorage.removeItem("user")
    setUser(null)
    setMenuOpen(false)
    router.push("/")
  }

  if (pathname?.startsWith("/admin")) return null
  if (!mounted) return null

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">

        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">💅</span>
          <span className="font-bold text-gray-900">سالن نیلوفر</span>
        </Link>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/booking/service">
            <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white">
              رزرو نوبت
            </Button>
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold">
                  {user.name ? user.name[0] : user.phone.slice(-2)}
                </div>
                <span className="text-sm text-gray-700">
                  {user.name || user.phone}
                </span>
                <span className="text-gray-400 text-xs">▾</span>
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-lg border z-50 overflow-hidden">
                    <div className="px-4 py-3 bg-pink-50 border-b">
                      <p className="text-sm font-bold text-gray-900">
                        {user.name || "کاربر"}
                      </p>
                      <p className="text-xs text-gray-500">{user.phone}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-pink-100 text-pink-600"
                      }`}>
                        {user.role === "admin" ? "ادمین" : "مشتری"}
                      </span>
                    </div>

                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-pink-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span>👤</span> پروفایل من
                    </Link>

                    {user.role === "admin" && (
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-purple-50"
                        onClick={() => setMenuOpen(false)}
                      >
                        <span>⚙️</span> پنل ادمین
                      </Link>
                    )}

                    <div className="border-t">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50"
                      >
                        <span>🚪</span> خروج از حساب
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="outline">
                ورود / ثبت‌نام
              </Button>
            </Link>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-1">
          <Link
            href="/booking/service"
            className="flex items-center gap-2 py-3 text-sm text-gray-700 border-b"
            onClick={() => setMenuOpen(false)}
          >
            <span>📅</span> رزرو نوبت
          </Link>

          {user ? (
            <>
              <div className="py-3 border-b flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold">
                  {user.name ? user.name[0] : user.phone.slice(-2)}
                </div>
                <div>
                  <p className="text-sm font-bold">{user.name || "کاربر"}</p>
                  <p className="text-xs text-gray-500">{user.phone}</p>
                </div>
              </div>
              <Link
                href="/profile"
                className="flex items-center gap-2 py-3 text-sm text-gray-700"
                onClick={() => setMenuOpen(false)}
              >
                <span>👤</span> پروفایل من
              </Link>
              {user.role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2 py-3 text-sm text-gray-700"
                  onClick={() => setMenuOpen(false)}
                >
                  <span>⚙️</span> پنل ادمین
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 py-3 text-sm text-red-500 w-full"
              >
                <span>🚪</span> خروج از حساب
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 py-3 text-sm text-gray-700"
              onClick={() => setMenuOpen(false)}
            >
              <span>🔑</span> ورود / ثبت‌نام
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}