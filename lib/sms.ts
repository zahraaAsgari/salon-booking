const API_KEY = process.env.KAVENEGAR_API_KEY
const SENDER = process.env.KAVENEGAR_SENDER

// وقتی Kavenegar فعال شد فقط این تابع رو uncomment کن
async function sendSMSReal(phone: string, message: string) {
  const res = await fetch(
    `https://api.kavenegar.com/v1/${API_KEY}/sms/send.json`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        receptor: phone,
        sender: SENDER!,
        message,
      }),
    }
  )
  return res.ok
}

// فعلاً فقط log میکنه — بعداً sendSMSReal رو صدا میزنه
async function sendSMS(phone: string, message: string) {
  console.log(`📱 پیامک به ${phone}:`)
  console.log(message)

  // وقتی Kavenegar فعال شد این رو uncomment کن:
  // if (API_KEY && SENDER) {
  //   await sendSMSReal(phone, message)
  // }

  return { success: true }
}

export async function sendOTP(phone: string, code: string) {
  const message = `کد تأیید سالن زیبایی: ${code}\nاین کد ۲ دقیقه معتبر است`
  return sendSMS(phone, message)
}

export async function sendAppointmentConfirmation(
  phone: string,
  data: {
    salonName: string
    date: string
    time: string
    service: string
    staff: string
  }
) {
  const message =
    `نوبت شما در ${data.salonName} تأیید شد ✅\n` +
    `سرویس: ${data.service}\n` +
    `متخصص: ${data.staff}\n` +
    `تاریخ: ${data.date} ساعت ${data.time}`
  return sendSMS(phone, message)
}

export async function sendCancellation(
  phone: string,
  salonName: string,
  date: string
) {
  const message = `نوبت شما در ${salonName} تاریخ ${date} لغو شد.\nبرای رزرو مجدد به سایت مراجعه کنید.`
  return sendSMS(phone, message)
}

export async function sendReminder(
  phone: string,
  data: { salonName: string; time: string; service: string }
) {
  const message =
    `یادآوری نوبت 🔔\n` +
    `فردا ساعت ${data.time} نوبت ${data.service} در ${data.salonName} دارید`
  return sendSMS(phone, message)
}