import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { generateOTP } from "@/lib/utils"

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json()

    if (!/^09[0-9]{9}$/.test(phone)) {
      return NextResponse.json(
        { error: "شماره موبایل معتبر نیست" },
        { status: 400 }
      )
    }

    await db.query(
      `INSERT INTO "User" (id, phone, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, NOW(), NOW())
       ON CONFLICT (phone) DO NOTHING`,
      [phone]
    )

    await db.query(
      `UPDATE "OtpCode" SET used = true WHERE phone = $1 AND used = false`,
      [phone]
    )

    const code = generateOTP()
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000)

    await db.query(
      `INSERT INTO "OtpCode" (id, code, phone, "expiresAt", used, "createdAt")
       VALUES (gen_random_uuid(), $1, $2, $3, false, NOW())`,
      [code, phone, expiresAt]
    )

    // وقتی Kavenegar تنظیم شد این رو uncomment کن:
    // await sendOTP(phone, code)

    return NextResponse.json({
      message: "کد ارسال شد",
      devCode: process.env.NODE_ENV === "development" ? code : undefined,
    })
  } catch (error) {
    console.error("خطا:", error)
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}