"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomeButtons() {
  const [user, setUser] = useState<{ name?: string; role?: string } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    const stored = localStorage.getItem("user")
    if (stored) setUser(JSON.parse(stored))
  }, [])

  if (!mounted) return null

  return (
    <div className="flex gap-3 justify-center flex-wrap">
      <Link href="/booking/service">
        <Button size="lg" className="bg-white text-pink-500 hover:bg-pink-50 px-8">
          همین الان نوبت بگیر
        </Button>
      </Link>

      {user ? (
        <Link href="/profile">
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-500 px-8">
            پروفایل من 👤
          </Button>
        </Link>
      ) : (
        <Link href="/login">
          <Button size="lg" variant="outline" className="border-white text-gray-400 hover:bg-white hover:text-pink-500 px-8">
            ورود / ثبت‌نام
          </Button>
        </Link>
      )}
    </div>
  )
}