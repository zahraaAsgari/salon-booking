import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { phone, role } = await req.json()

    const otpResult = await db.query(
         `SELECT * FROM "Admin" WHERE phone = $1`,
      [phone]
    )

    if (otpResult.rows.length === 0) {
      return NextResponse.json(
        { error: "کد اشتباه یا منقضی شده" },
        { status: 400 }
      )
    }

    await db.query(
      `UPDATE "OtpCode" SET used = true WHERE id = $1`,
      [otpResult.rows[0].id]
    )

    // اگه ادمین انتخاب شده چک کن توی جدول Admin هست
    if (role === "admin") {
      const adminResult = await db.query(
        `SELECT * FROM "Admin" WHERE phone = $1`,
        [phone]
      )

      if (adminResult.rows.length === 0) {
        return NextResponse.json(
          { error: "این شماره دسترسی ادمین ندارد" },
          { status: 403 }
        )
      }

      return NextResponse.json({
        success: true,
        user: {
          id: adminResult.rows[0].id,
          phone,
          name: adminResult.rows[0].name,
          role: "admin",
        },
      })
    }

    // کاربر عادی
    const user = await db.query(
      `SELECT * FROM "User" WHERE phone = $1`,
      [phone]
    )

    return NextResponse.json({
      success: true,
      user: { ...user.rows[0], role: "customer" },
    })
  } catch (error) {
    console.error("خطا:", error)
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}