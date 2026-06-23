import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const { status } = await req.json()
    const result = await db.query(
      `UPDATE "Appointment" 
       SET status = $1, "updatedAt" = NOW()
       WHERE id = $2 RETURNING *`,
      [status, id]
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
    await db.query(`DELETE FROM "Appointment" WHERE id = $1`, [id])
    return NextResponse.json({ message: "نوبت حذف شد" })
  } catch (_error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}