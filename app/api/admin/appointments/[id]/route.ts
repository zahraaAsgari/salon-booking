import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json()

    const result = await db.query(
      `UPDATE "Appointment" 
       SET status = $1, "updatedAt" = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, params.id]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("خطا:", error)
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.query(`DELETE FROM "Appointment" WHERE id = $1`, [params.id])
    return NextResponse.json({ message: "نوبت حذف شد" })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}