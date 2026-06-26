import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const salonId = searchParams.get("salonId") || "salon-1"

    const result = await db.query(
      `SELECT * FROM "Gallery" WHERE "salonId" = $1 ORDER BY "order" ASC`,
      [salonId]
    )

    return NextResponse.json(result.rows)
  } catch (_error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { salonId, url, title, order } = await req.json()

    const result = await db.query(
      `INSERT INTO "Gallery" (id, "salonId", url, title, "order", "createdAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
       RETURNING *`,
      [salonId, url, title || "", order || 0]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (_error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    await db.query(`DELETE FROM "Gallery" WHERE id = $1`, [id])
    return NextResponse.json({ message: "حذف شد" })
  } catch (_error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}