import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const result = await db.query(
      `SELECT * FROM "Staff" WHERE "isActive" = true ORDER BY name ASC`
    )
    console.log("staff:", result.rows) // برای دیباگ
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("خطا:", error)
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    )
  }
}