import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("شروع seed...")

  // ساخت ادمین
  const hashedPassword = await bcrypt.hash("admin123", 10)
  await prisma.admin.upsert({
    where: { email: "admin@salon.com" },
    update: {},
    create: {
      email: "admin@salon.com",
      password: hashedPassword,
      name: "مدیر سالن",
    },
  })
  console.log("✅ ادمین ساخته شد")

  // ساخت سرویس‌ها
  const servicesData = [
    { name: "کوتاهی مو", price: 150000, duration: 45, description: "کوتاهی و فرم‌دهی مو" },
    { name: "رنگ مو", price: 400000, duration: 120, description: "رنگ کامل مو" },
    { name: "هایلایت", price: 600000, duration: 180, description: "هایلایت و بالیاژ" },
    { name: "مانیکور", price: 120000, duration: 60, description: "مانیکور کلاسیک" },
    { name: "پدیکور", price: 150000, duration: 75, description: "پدیکور کامل" },
  ]

  for (const s of servicesData) {
    await prisma.service.create({ data: s })
  }
  console.log("✅ سرویس‌ها ساخته شدن")

  // ساخت متخصصان
  const staffData = [
    { name: "خانم احمدی", specialty: "کوتاهی و رنگ" },
    { name: "خانم رضایی", specialty: "مانیکور و پدیکور" },
    { name: "خانم محمدی", specialty: "هایلایت و بافت" },
  ]

  for (const s of staffData) {
    const staff = await prisma.staff.create({ data: s })

    for (let day = 0; day <= 4; day++) {
      await prisma.workSchedule.create({
        data: {
          staffId: staff.id,
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "17:00",
        },
      })
    }
  }
  console.log("✅ متخصصان ساخته شدن")
  console.log("✅ seed کامل شد!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())