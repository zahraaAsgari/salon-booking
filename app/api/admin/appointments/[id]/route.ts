/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PATCH(
  req: NextRequest,
  // { params }: { params: Promise<{ id: string }> }
    context: { params: Promise<{ id: string }> }
) {
  try {
    // const { id } = await params
        const { id } = await context.params
    const { status } = await req.json()

    const result = await db.query(
      `UPDATE "Appointment" 
       SET status = $1, "updatedAt" = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, id]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  // { params }: { params: Promise<{ id: string }> }
    context: { params: Promise<{ id: string }> }
) {
  try {
    // const { id } = await params
      const { id } = await context.params
    await db.query(`DELETE FROM "Appointment" WHERE id = $1`, [id])
    return NextResponse.json({ message: "نوبت حذف شد" })
  } catch (error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}