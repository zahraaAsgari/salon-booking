import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const { name, specialty, phone, isActive } = await req.json()
    const result = await db.query(
      `UPDATE "Staff" SET name = $1, specialty = $2, phone = $3, "isActive" = $4
       WHERE id = $5 RETURNING *`,
      [name, specialty, phone || null, isActive, id]
    )
    return NextResponse.json(result.rows[0])
  } catch (_error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    await db.query(`DELETE FROM "Staff" WHERE id = $1`, [id])
    return NextResponse.json({ message: "متخصص حذف شد" })
  } catch (_error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}