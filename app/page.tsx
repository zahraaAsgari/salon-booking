import Link from "next/link"
import { Button } from "@/components/ui/button"

const HomeButtons = () => {
  return (
    <div className="flex justify-center gap-3">
      <Link href="/booking/service">
        <Button size="lg" className="bg-pink-500 text-white hover:bg-pink-600 px-6">
          رزرو نوبت
        </Button>
      </Link>
      <Link href="/contact">
        <Button size="lg" className="bg-white text-pink-500 hover:bg-pink-50 px-6">
          تماس با ما
        </Button>
      </Link>
    </div>
  )
}

const services = [
  { icon: "✂️", name: "کوتاهی مو", price: "از ۱۵۰,۰۰۰ تومان" },
  { icon: "🎨", name: "رنگ و هایلایت", price: "از ۴۰۰,۰۰۰ تومان" },
  { icon: "💅", name: "مانیکور و پدیکور", price: "از ۱۲۰,۰۰۰ تومان" },
  { icon: "✨", name: "کراتین و بافت", price: "از ۸۰۰,۰۰۰ تومان" },
]

const steps = [
  { step: "۱", title: "انتخاب سرویس", desc: "سرویس مورد نظر را انتخاب کنید" },
  { step: "۲", title: "انتخاب متخصص", desc: "با متخصص دلخواه نوبت بگیرید" },
  { step: "۳", title: "انتخاب زمان", desc: "روز و ساعت مناسب را انتخاب کنید" },
  { step: "۴", title: "تأیید نوبت", desc: "نوبت شما ثبت و تأیید می‌شود" },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white" dir="rtl">

      {/* هیرو */}
      <section className="bg-linear-to-b from-pink-50 to-white py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-7xl">💅</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            سالن زیبایی نیلوفر
          </h1>
          <p className="text-lg text-gray-500">
            رزرو آنلاین نوبت — سریع، ساده و بدون معطلی
          </p>
          {/* دکمه‌های هوشمند - client component */}
          <HomeButtons />
        </div>
      </section>

      {/* سرویس‌ها */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">خدمات ما</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((s) => (
              <div key={s.name} className="bg-white rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-all">
                <div className="text-4xl mb-3">{s.icon}</div>
                <p className="font-semibold text-gray-900 text-sm">{s.name}</p>
                <p className="text-xs text-pink-500 mt-1">{s.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* مراحل */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">رزرو نوبت در ۴ قدم</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-pink-500 text-white flex items-center justify-center text-xl font-bold mx-auto">
                  {s.step}
                </div>
                <p className="font-semibold text-gray-900">{s.title}</p>
                <p className="text-xs text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-pink-500 text-white text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold">آماده‌اید؟</h2>
          <p className="text-pink-100">همین الان نوبت خود را رزرو کنید</p>
          <Link href="/booking/service">
            <Button size="lg" className="bg-white text-pink-500 hover:bg-pink-50 px-8">
              رزرو نوبت رایگان
            </Button>
          </Link>
        </div>
      </section>

      {/* فوتر */}
      <footer className="py-8 px-4 text-center text-sm text-gray-400 border-t">
        <p>سالن زیبایی نیلوفر © ۱۴۰۵</p>
      </footer>
    </main>
  )
}