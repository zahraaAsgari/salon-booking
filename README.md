# 💅 سیستم نوبت‌دهی سالن زیبایی

یک اپلیکیشن وب کامل برای مدیریت نوبت‌های سالن زیبایی، ساخته شده با Next.js 15

## ✨ امکانات

### مشتری
- رزرو آنلاین نوبت در ۴ مرحله ساده
- ورود با شماره موبایل و کد OTP
- مشاهده و لغو نوبت‌های آینده
- تاریخچه نوبت‌ها
- پروفایل کاربری

### ادمین
- داشبورد با آمار کلی
- مدیریت نوبت‌ها (تأیید، لغو، انجام شده)
- مدیریت سرویس‌ها (افزودن، ویرایش، حذف)
- مدیریت متخصصان و ساعت کاری
- ربط متخصص به سرویس‌های مخصوص

## 🛠 تکنولوژی‌ها

| بخش | تکنولوژی |
|-----|----------|
| فریمورک | Next.js 15 (App Router) |
| زبان | TypeScript |
| استایل | Tailwind CSS + shadcn/ui |
| دیتابیس | PostgreSQL (Neon.tech) |
| ارتباط با دیتابیس | pg (node-postgres) |
| پیامک | Kavenegar |
| فونت | Vazirmatn |
| دیپلوی | Vercel |

## 📁 ساختار پروژه
## 🚀 راه‌اندازی محلی

### پیش‌نیازها
- Node.js v18+
- اکانت Neon.tech (دیتابیس رایگان)
- اکانت Kavenegar (پیامک)

### مراحل

**۱. کلون کردن پروژه**
```bash
git clone https://github.com/username/salon-booking.git
cd salon-booking
```

**۲. نصب پکیج‌ها**
```bash
npm install
```

**۳. تنظیم متغیرهای محیطی**
```bash
cp .env.example .env
```
فایل `.env` را با اطلاعات خود پر کنید:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
KAVENEGAR_API_KEY=""
KAVENEGAR_SENDER=""
```

**۴. ساخت جدول‌های دیتابیس**
```bash
npx prisma migrate dev
```

**۵. اجرای پروژه**
```bash
npm run dev
```

سایت روی `http://localhost:3000` در دسترس است.

## 🗄 دیتابیس

ساختار جدول‌ها:
## 📱 پیامک

برای فعال‌سازی پیامک واقعی:
1. در [kavenegar.com](https://kavenegar.com) ثبت‌نام کنید
2. API Key را دریافت کنید
3. در فایل `.env` وارد کنید
4. در `app/api/auth/send-otp/route.ts` خط `sendOTP` را uncomment کنید

## 🌐 دیپلوی روی Vercel

1. پروژه را روی GitHub قرار دهید
2. در [vercel.com](https://vercel.com) وارد شوید
3. پروژه را import کنید
4. متغیرهای محیطی را تنظیم کنید
5. دیپلوی کنید

## 👤 ورود ادمین

برای ورود به پنل ادمین:
1. شماره موبایل ادمین را در جدول `Admin` ثبت کنید
2. از صفحه `/login` گزینه "ورود به عنوان ادمین" را انتخاب کنید

## 📄 لایسنس

MIT