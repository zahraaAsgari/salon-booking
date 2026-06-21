import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")

    const result = await db.query(
      `SELECT 
        a.id, a.date, a.status, a."totalPrice", a.notes,
        u.phone as user_phone, u.name as user_name,
        s.name as service_name, s.duration as service_duration,
        st.name as staff_name
       FROM "Appointment" a
       JOIN "User" u ON a."userId" = u.id
       JOIN "Service" s ON a."serviceId" = s.id
       JOIN "Staff" st ON a."staffId" = st.id
       ${status ? `WHERE a.status = $1` : ""}
       ORDER BY a.date DESC`,
      status ? [status] : []
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("خطا:", error)
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}