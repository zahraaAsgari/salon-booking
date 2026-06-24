import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const salonId = searchParams.get("salonId") || "salon-1"

    const result = await db.query(
      `SELECT * FROM "Service" 
       WHERE "isActive" = true AND "salonId" = $1
       ORDER BY name ASC`,
      [salonId]
    )
    return NextResponse.json(result.rows)
  } catch (_error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, price, duration, salonId } = await req.json()
    const result = await db.query(
      `INSERT INTO "Service" (id, name, description, price, duration, "isActive", "salonId", "createdAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, true, $5, NOW())
       RETURNING *`,
      [name, description, price, duration, salonId || "salon-1"]
    )
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (_error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}