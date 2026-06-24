import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendOTP } from "@/lib/sms"
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

    // ارسال پیامک واقعی
    const smsResult = await sendOTP(phone, code)

    if (!smsResult.success) {
      console.error("خطا در ارسال پیامک")
    }

    return NextResponse.json({
      message: "کد ارسال شد",
      // فقط در development کد رو برگردون
      ...(process.env.NODE_ENV === "development" && { devCode: code }),
    })
  } catch (_error) {
    console.error("خطا:", _error)
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}