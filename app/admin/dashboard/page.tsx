"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"

interface Stats {
  total: number
  pending: number
  confirmed: number
  today: number
  revenue: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
  }, [])

  const cards = [
    { label: "کل نوبت‌ها", value: stats?.total ?? 0, icon: "📅", color: "bg-blue-50 text-blue-600" },
    { label: "در انتظار تأیید", value: stats?.pending ?? 0, icon: "⏳", color: "bg-yellow-50 text-yellow-600" },
    { label: "تأیید شده", value: stats?.confirmed ?? 0, icon: "✅", color: "bg-green-50 text-green-600" },
    { label: "نوبت‌های امروز", value: stats?.today ?? 0, icon: "🗓", color: "bg-pink-50 text-pink-600" },
    { label: "درآمد کل", value: formatPrice(stats?.revenue ?? 0), icon: "💰", color: "bg-purple-50 text-purple-600" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">داشبورد</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent className={`p-4 rounded-lg ${card.color}`}>
              <div className="text-2xl mb-1">{card.icon}</div>
              <p className="text-sm opacity-75">{card.label}</p>
              <p className="text-xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}