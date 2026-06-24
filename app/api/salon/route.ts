import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get("slug") || "niloofar"

    const result = await db.query(
      `SELECT * FROM "Salon" WHERE slug = $1 AND "isActive" = true`,
      [slug]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "سالن پیدا نشد" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (_error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { salonId, name, phone, address, description, logo, heroImage } = await req.json()

    const result = await db.query(
      `UPDATE "Salon" 
       SET name = $1, phone = $2, address = $3, description = $4, 
           logo = $5, "heroImage" = $6
       WHERE id = $7 RETURNING *`,
      [name, phone, address, description, logo, heroImage, salonId]
    )

    return NextResponse.json(result.rows[0])
  } catch (_error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}