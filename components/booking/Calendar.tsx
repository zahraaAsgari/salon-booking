"use client"

import { useState } from "react"
import moment from "moment-jalaali"

moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true })

interface CalendarProps {
  onSelectDate: (date: Date) => void
  selectedDate: Date | null
}

const DAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"]

export default function PersianCalendar({ onSelectDate, selectedDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(moment())
  const today = moment()
  const startOfMonth = currentMonth.clone().startOf("jMonth")
  const daysInMonth = currentMonth.daysInMonth()

  let startDay = startOfMonth.day() + 1
  if (startDay === 7) startDay = 0

  function isPast(day: number) {
    const date = currentMonth.clone().jDate(day)
    return date.isBefore(today, "day")
  }

  function isSelected(day: number) {
    if (!selectedDate) return false
    const m = moment(selectedDate)
    return (
      m.jDate() === day &&
      m.jMonth() === currentMonth.jMonth() &&
      m.jYear() === currentMonth.jYear()
    )
  }

  function isToday(day: number) {
    return (
      today.jDate() === day &&
      today.jMonth() === currentMonth.jMonth() &&
      today.jYear() === currentMonth.jYear()
    )
  }

  function handleSelectDay(day: number) {
    if (isPast(day)) return
    onSelectDate(currentMonth.clone().jDate(day).toDate())
  }

  const days: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(currentMonth.clone().add(1, "jMonth"))}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          ‹
        </button>
        <h3 className="font-bold text-gray-900">
          {currentMonth.format("jMMMM jYYYY")}
        </h3>
        <button
          onClick={() => setCurrentMonth(currentMonth.clone().subtract(1, "jMonth"))}
          className="p-2 rounded-lg hover:bg-gray-100"
          disabled={currentMonth.jMonth() === today.jMonth() && currentMonth.jYear() === today.jYear()}
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <div key={i} className="aspect-square">
            {day ? (
              <button
                onClick={() => handleSelectDay(day)}
                disabled={isPast(day)}
                className={`w-full h-full rounded-xl text-sm font-medium transition-all
                  ${isPast(day)
                    ? "text-gray-300 cursor-not-allowed"
                    : isSelected(day)
                    ? "bg-pink-500 text-white shadow-md"
                    : isToday(day)
                    ? "border-2 border-pink-400 text-pink-500"
                    : "hover:bg-pink-50 text-gray-700"
                  }`}
              >
                {day}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}