import axios from "axios"

const API_KEY = process.env.KAVENEGAR_API_KEY!
const SENDER = process.env.KAVENEGAR_SENDER!

export async function sendSMS(phone: string, message: string) {
  try {
    await axios.post(
      `https://api.kavenegar.com/v1/${API_KEY}/sms/send.json`,
      { receptor: phone, sender: SENDER, message }
    )
    return { success: true }
  } catch (error) {
    console.error("خطا در ارسال پیامک:", error)
    return { success: false }
  }
}

export async function sendOTP(phone: string, code: string) {
  const message = `کد تأیید سالن زیبایی: ${code}\nاین کد ۲ دقیقه معتبر است`
  return sendSMS(phone, message)
}

export async function sendAppointmentConfirmation(
  phone: string,
  data: { date: string; time: string; service: string; staff: string }
) {
  const message =
    `نوبت شما تأیید شد ✅\n` +
    `سرویس: ${data.service}\n` +
    `متخصص: ${data.staff}\n` +
    `تاریخ: ${data.date} ساعت ${data.time}`
  return sendSMS(phone, message)
}

export async function sendCancellation(phone: string, date: string) {
  const message = `نوبت شما در تاریخ ${date} لغو شد.\nبرای رزرو مجدد به سایت مراجعه کنید.`
  return sendSMS(phone, message)
}

export async function sendReminder(
  phone: string,
  data: { time: string; service: string }
) {
  const message =
    `یادآوری نوبت 🔔\n` +
    `فردا ساعت ${data.time} نوبت ${data.service} دارید`
  return sendSMS(phone, message)
}