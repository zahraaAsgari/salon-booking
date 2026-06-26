"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
// import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<"choose" | "phone" | "otp">("choose")
  const [role, setRole] = useState<"customer" | "admin">("customer")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [devCode, setDevCode] = useState("") // فقط برای تست
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSendOTP() {
    setLoading(true)
    setError("")
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      setDevCode(data.devCode || "") // کد رو از API میگیریم
      setStep("otp")
    } else {
      setError(data.error)
    }
  }

 async function handleVerifyOTP() {
  setLoading(true)
  setError("")
  const res = await fetch("/api/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, code: otp, role }),
  })
  const data = await res.json()
  setLoading(false)

  if (res.ok) {
    const userData = { ...data.user, role }

    // ذخیره توی localStorage
    localStorage.setItem("user", JSON.stringify(userData))

    // ذخیره توی کوکی برای middleware
    document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=604800`

    if (role === "admin") {
      router.push("/admin/dashboard")
    } else {
      router.push("/")
    }
  } else {
    setError(data.error)
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md" dir="rtl">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">💅</div>
          <CardTitle>
            {step === "choose" && "ورود به سیستم"}
            {step === "phone" && role === "customer" ? "ورود مشتری" : step === "phone" ? "ورود ادمین" : ""}
            {step === "otp" && "تأیید شماره"}
          </CardTitle>
          <CardDescription>
            {step === "choose" && "نوع ورود را انتخاب کنید"}
            {step === "phone" && "شماره موبایل خود را وارد کنید"}
            {step === "otp" && `کد ارسال شده به ${phone} را وارد کنید`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* مرحله انتخاب نقش */}
          {step === "choose" && (
            <div className="space-y-3">
              <button
                onClick={() => { setRole("customer"); setStep("phone") }}
                className="w-full p-4 border-2 rounded-xl text-right hover:border-pink-400 hover:bg-pink-50 transition-all flex items-center gap-3"
              >
                <span className="text-3xl">👤</span>
                <div>
                  <p className="font-semibold">ورود به عنوان مشتری</p>
                  <p className="text-sm text-gray-500">رزرو نوبت و مشاهده تاریخچه</p>
                </div>
              </button>
              <button
                onClick={() => { setRole("admin"); setStep("phone") }}
                className="w-full p-4 border-2 rounded-xl text-right hover:border-purple-400 hover:bg-purple-50 transition-all flex items-center gap-3"
              >
                <span className="text-3xl">⚙️</span>
                <div>
                  <p className="font-semibold">ورود به عنوان ادمین</p>
                  <p className="text-sm text-gray-500">مدیریت سالن و نوبت‌ها</p>
                </div>
              </button>
            </div>
          )}

          {/* مرحله شماره موبایل */}
          {step === "phone" && (
            <>
              <div className="space-y-2">
                <Label>شماره موبایل</Label>
                <Input
                  placeholder="09123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  dir="ltr"
                  className="text-center"
                  maxLength={11}
                />
              </div>
              <Button
                className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                onClick={handleSendOTP}
                disabled={loading || phone.length !== 11}
              >
                {loading ? "در حال ارسال..." : "ارسال کد تأیید"}
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setStep("choose")}>
                بازگشت
              </Button>
            </>
          )}

          {/* مرحله OTP */}
          {step === "otp" && (
            <>
              {/* نمایش کد برای تست - بعداً حذف کن */}
              {devCode && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <p className="text-xs text-yellow-600 mb-1">کد تأیید (فقط برای تست):</p>
                  <p className="text-2xl font-bold text-yellow-700 tracking-widest">{devCode}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label>کد ۴ رقمی</Label>
                <Input
                  placeholder="1234"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={4}
                  dir="ltr"
                  className="text-center text-2xl tracking-widest"
                />
              </div>
              <Button
                className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 4}
              >
                {loading ? "در حال بررسی..." : "تأیید و ورود"}
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setStep("phone")}>
                تغییر شماره
              </Button>
            </>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </CardContent>
      </Card>
    </div>
  )
}