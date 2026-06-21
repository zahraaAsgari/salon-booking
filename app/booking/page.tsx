import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4" dir="rtl">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-7xl">✅</div>
        <h1 className="text-2xl font-bold text-gray-900">نوبت شما ثبت شد!</h1>
        <p className="text-gray-500">
          نوبت شما با موفقیت ثبت شد. جزئیات نوبت به زودی برایتان ارسال می‌شود.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/booking/service">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white">
              رزرو نوبت جدید
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">بازگشت به خانه</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}