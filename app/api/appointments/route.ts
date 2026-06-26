import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendAppointmentConfirmation } from "@/lib/sms"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    const result = await db.query(
      `SELECT a.*, 
        s.name as service_name, s.price as service_price, s.duration as service_duration,
        st.name as staff_name, st.specialty as staff_specialty,
        sal.name as salon_name
       FROM "Appointment" a
       JOIN "Service" s ON a."serviceId" = s.id
       JOIN "Staff" st ON a."staffId" = st.id
       LEFT JOIN "Salon" sal ON a."salonId" = sal.id
       ${userId ? `WHERE a."userId" = $1` : ""}
       ORDER BY a.date ASC`,
      userId ? [userId] : []
    )

    return NextResponse.json(result.rows)
  } catch (_error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, serviceId, staffId, date, notes, salonId } = await req.json()

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

    // چک تداخل
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
        (id, "userId", "serviceId", "staffId", "salonId", date, status, "totalPrice", notes, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'PENDING', $6, $7, NOW(), NOW())
       RETURNING *`,
      [userId, serviceId, staffId, salonId || "salon-1", appointmentDate, service.price, notes || null]
    )

    // گرفتن اطلاعات برای پیامک
    const [userResult, staffResult, salonResult] = await Promise.all([
      db.query(`SELECT phone FROM "User" WHERE id = $1`, [userId]),
      db.query(`SELECT name FROM "Staff" WHERE id = $1`, [staffId]),
      db.query(`SELECT name FROM "Salon" WHERE id = $1`, [salonId || "salon-1"]),
    ])

    const phone = userResult.rows[0]?.phone
    const staffName = staffResult.rows[0]?.name
    const salonName = salonResult.rows[0]?.name

    if (phone) {
      await sendAppointmentConfirmation(phone, {
        salonName: salonName || "سالن زیبایی",
        date: appointmentDate.toLocaleDateString("fa-IR"),
        time: appointmentDate.toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        service: service.name,
        staff: staffName || "",
      })
    }

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (_error) {
    console.error("خطا:", _error)
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}