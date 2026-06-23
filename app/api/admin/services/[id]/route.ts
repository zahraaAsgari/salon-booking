import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const { name, description, price, duration, isActive } = await req.json()
    const result = await db.query(
      `UPDATE "Service" 
       SET name = $1, description = $2, price = $3, duration = $4, "isActive" = $5
       WHERE id = $6 RETURNING *`,
      [name, description, price, duration, isActive, id]
    )
    return NextResponse.json(result.rows[0])
  } catch (_error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    await db.query(`DELETE FROM "Service" WHERE id = $1`, [id])
    return NextResponse.json({ message: "سرویس حذف شد" })
  } catch (_error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}