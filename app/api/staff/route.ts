import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const serviceId = searchParams.get("serviceId")

    const result = await db.query(
      `SELECT DISTINCT s.* FROM "Staff" s
       ${serviceId
         ? `JOIN "StaffService" ss ON s.id = ss."staffId"
            WHERE ss."serviceId" = $1 AND s."isActive" = true`
         : `WHERE s."isActive" = true`
       }
       ORDER BY s.name ASC`,
      serviceId ? [serviceId] : []
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("خطا:", error)
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}