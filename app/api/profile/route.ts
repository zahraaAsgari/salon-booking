import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId لازم است" }, { status: 400 })
    }

    const user = await db.query(
      `SELECT id, phone, name, "createdAt" FROM "User" WHERE id = $1`,
      [userId]
    )

    if (user.rows.length === 0) {
      return NextResponse.json({ error: "کاربر پیدا نشد" }, { status: 404 })
    }

    return NextResponse.json(user.rows[0])
  } catch (error) {
    console.error("خطا:", error)
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId, name } = await req.json()

    const result = await db.query(
      `UPDATE "User" SET name = $1, "updatedAt" = NOW() WHERE id = $2 RETURNING *`,
      [name, userId]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("خطا:", error)
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}