import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    const result = await db.query(
      `SELECT a.*, 
        s.name as service_name, s.price as service_price, s.duration as service_duration,
        st.name as staff_name, st.specialty as staff_specialty
       FROM "Appointment" a
       JOIN "Service" s ON a."serviceId" = s.id
       JOIN "Staff" st ON a."staffId" = st.id
       ${userId ? `WHERE a."userId" = $1` : ""}
       ORDER BY a.date ASC`,
      userId ? [userId] : []
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("خطا:", error)
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, serviceId, staffId, date, notes } = await req.json()
    console.log("دریافتی:", { userId, serviceId, staffId, date, notes })

    // گرفتن مدت زمان سرویس
    const serviceResult = await db.query(
      `SELECT * FROM "Service" WHERE id = $1`,
      [serviceId]
    )

    if (serviceResult.rows.length === 0) {
      return NextResponse.json({ error: "سرویس پیدا نشد" }, { status: 404 })
    }

    const service = serviceResult.rows[0]
    const appointmentDate = new Date(date)
    const endTime = new Date(appointmentDate.getTime() + service.duration * 60000)

    // چک کردن تداخل
    const conflict = await db.query(
      `SELECT id FROM "Appointment"
       WHERE "staffId" = $1
       AND status != 'CANCELLED'
       AND date >= $2 AND date < $3`,
      [staffId, appointmentDate, endTime]
    )

    if (conflict.rows.length > 0) {
      return NextResponse.json(
        { error: "این ساعت قبلاً رزرو شده" },
        { status: 409 }
      )
    }

    // ثبت نوبت
    const result = await db.query(
      `INSERT INTO "Appointment" 
        (id, "userId", "serviceId", "staffId", date, status, "totalPrice", notes, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, 'PENDING', $5, $6, NOW(), NOW())
       RETURNING *`,
      [userId, serviceId, staffId, appointmentDate, service.price, notes || null]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("خطا:", error)
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}