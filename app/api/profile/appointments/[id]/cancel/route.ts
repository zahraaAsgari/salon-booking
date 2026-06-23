import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PATCH(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const appointment = await db.query(
      `SELECT date FROM "Appointment" WHERE id = $1`,
      [id]
    )

    if (appointment.rows.length === 0) {
      return NextResponse.json({ error: "نوبت پیدا نشد" }, { status: 404 })
    }

    const appointmentDate = new Date(appointment.rows[0].date)
    const diffHours = (appointmentDate.getTime() - Date.now()) / (1000 * 60 * 60)

    if (diffHours < 2) {
      return NextResponse.json(
        { error: "لغو نوبت کمتر از ۲ ساعت مانده امکان‌پذیر نیست" },
        { status: 400 }
      )
    }

    const result = await db.query(
      `UPDATE "Appointment" 
       SET status = 'CANCELLED', "updatedAt" = NOW()
       WHERE id = $1 RETURNING *`,
      [id]
    )

    return NextResponse.json(result.rows[0])
  } catch (_error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}