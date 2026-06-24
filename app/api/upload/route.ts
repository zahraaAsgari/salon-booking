import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "فایل انتخاب نشده" }, { status: 400 })
    }

    // تبدیل به base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataUri = `data:${file.type};base64,${base64}`

    // آپلود به Cloudinary
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    const timestamp = Math.round(Date.now() / 1000)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const signature = require("crypto")
      .createHash("sha1")
      .update(`timestamp=${timestamp}${apiSecret}`)
      .digest("hex")

    const formDataCloud = new FormData()
    formDataCloud.append("file", dataUri)
    formDataCloud.append("api_key", apiKey!)
    formDataCloud.append("timestamp", timestamp.toString())
    formDataCloud.append("signature", signature)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formDataCloud }
    )

    const data = await response.json()
    return NextResponse.json({ url: data.secure_url })
  } catch (_error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}