import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAvailableSlots } from "@/lib/utils"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const staffId = searchParams.get("staffId")
    const serviceId = searchParams.get("serviceId")
    const date = searchParams.get("date") // "2026-06-21"

    if (!staffId || !serviceId || !date) {
      return NextResponse.json(
        { error: "پارامترها ناقص است" },
        { status: 400 }
      )
    }

    // گرفتن مدت زمان سرویس
    const serviceResult = await db.query(
      `SELECT duration FROM "Service" WHERE id = $1`,
      [serviceId]
    )

    if (serviceResult.rows.length === 0) {
      return NextResponse.json(
        { error: "سرویس پیدا نشد" },
        { status: 404 }
      )
    }

    const duration = serviceResult.rows[0].duration

    // گرفتن ساعت کاری متخصص برای این روز
    const dayOfWeek = new Date(date).getDay()
    // تبدیل روز هفته از JS به فارسی (0=شنبه)
    const persianDay = (dayOfWeek + 1) % 7

    const scheduleResult = await db.query(
      `SELECT * FROM "WorkSchedule" 
       WHERE "staffId" = $1 AND "dayOfWeek" = $2 AND "isOff" = false`,
      [staffId, persianDay]
    )

    if (scheduleResult.rows.length === 0) {
      return NextResponse.json({ slots: [], message: "این روز تعطیل است" })
    }

    const schedule = scheduleResult.rows[0]

    // گرفتن نوبت‌های رزرو شده این روز
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const bookedResult = await db.query(
      `SELECT date FROM "Appointment"
       WHERE "staffId" = $1 
       AND date >= $2 
       AND date <= $3
       AND status != 'CANCELLED'`,
      [staffId, startOfDay, endOfDay]
    )

    // تبدیل نوبت‌های رزرو شده به فرمت "HH:mm"
    const bookedSlots = bookedResult.rows.map((row: { date: Date }) => {
      const d = new Date(row.date)
      return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`
    })

    // پیدا کردن ساعت‌های خالی
    const slots = getAvailableSlots(
      schedule.startTime,
      schedule.endTime,
      duration,
      bookedSlots
    )

    return NextResponse.json({ slots })
  } catch (error) {
    console.error("خطا:", error)
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    )
  }
}