import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, description, price, duration, isActive } = await req.json()
    const result = await db.query(
      `UPDATE "Service" 
       SET name = $1, description = $2, price = $3, duration = $4, "isActive" = $5
       WHERE id = $6 RETURNING *`,
      [name, description, price, duration, isActive, params.id]
    )
    return NextResponse.json(result.rows[0])
  } catch (error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.query(`DELETE FROM "Service" WHERE id = $1`, [params.id])
    return NextResponse.json({ message: "سرویس حذف شد" })
  } catch (error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}