
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { faIR } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان"
}

export function formatDate(date: Date): string {
  return format(date, "EEEE d MMMM yyyy", { locale: faIR })
}

export function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export function getAvailableSlots(
  workStart: string,
  workEnd: string,
  duration: number,
  bookedSlots: string[]
): string[] {
  const slots: string[] = []
  const [startH, startM] = workStart.split(":").map(Number)
  const [endH, endM] = workEnd.split(":").map(Number)

  let currentMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM

  while (currentMinutes + duration <= endMinutes) {
    const hour = Math.floor(currentMinutes / 60)
    const minute = currentMinutes % 60
    const slot = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`

    if (!bookedSlots.includes(slot)) {
      slots.push(slot)
    }

    currentMinutes += 30
  }

  return slots
}