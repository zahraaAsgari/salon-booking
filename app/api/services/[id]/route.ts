import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await db.query(
      `SELECT * FROM "Service" WHERE id = $1`,
      [params.id]
    )
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "پیدا نشد" }, { status: 404 })
    }
    return NextResponse.json(result.rows[0])
  } catch (error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}