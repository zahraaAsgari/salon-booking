import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const result = await db.query(
      `SELECT * FROM "Service" ORDER BY "createdAt" DESC`
    )
    return NextResponse.json(result.rows)
  } catch (error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, price, duration } = await req.json()
    const result = await db.query(
      `INSERT INTO "Service" (id, name, description, price, duration, "isActive", "createdAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, true, NOW())
       RETURNING *`,
      [name, description, price, duration]
    )
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}