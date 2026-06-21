import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId لازم است" }, { status: 400 })
    }

    const result = await db.query(
      `SELECT 
        a.id, a.date, a.status, a."totalPrice", a.notes,
        s.name as service_name, s.duration as service_duration,
        st.name as staff_name
       FROM "Appointment" a
       JOIN "Service" s ON a."serviceId" = s.id
       JOIN "Staff" st ON a."staffId" = st.id
       WHERE a."userId" = $1
       ORDER BY a.date DESC`,
      [userId]
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("خطا:", error)
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}