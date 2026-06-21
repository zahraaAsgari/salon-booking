import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const result = await db.query(
      `SELECT * FROM "Staff" ORDER BY "createdAt" DESC`
    )
    return NextResponse.json(result.rows)
  } catch (error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, specialty, phone } = await req.json()
    const staff = await db.query(
      `INSERT INTO "Staff" (id, name, specialty, phone, "isActive", "createdAt")
       VALUES (gen_random_uuid(), $1, $2, $3, true, NOW())
       RETURNING *`,
      [name, specialty, phone || null]
    )

    // ساخت ساعت کاری پیش‌فرض شنبه تا چهارشنبه
    for (let day = 0; day <= 4; day++) {
      await db.query(
        `INSERT INTO "WorkSchedule" (id, "staffId", "dayOfWeek", "startTime", "endTime", "isOff")
         VALUES (gen_random_uuid(), $1, $2, '09:00', '17:00', false)`,
        [staff.rows[0].id, day]
      )
    }

    return NextResponse.json(staff.rows[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}