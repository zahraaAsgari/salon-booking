import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const serviceId = searchParams.get("serviceId")
    const salonId = searchParams.get("salonId") || "salon-1"

    const result = await db.query(
      `SELECT DISTINCT s.* FROM "Staff" s
       ${serviceId
         ? `JOIN "StaffService" ss ON s.id = ss."staffId"
            WHERE ss."serviceId" = $1 AND s."isActive" = true AND s."salonId" = $2`
         : `WHERE s."isActive" = true AND s."salonId" = $1`
       }
       ORDER BY s.name ASC`,
      serviceId ? [serviceId, salonId] : [salonId]
    )

    return NextResponse.json(result.rows)
  } catch (_error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}