"use client"

import Loading from "@/components/Loading"

interface TimeSlotsProps {
  slots: string[]
  selected: string | null
  loading: boolean
  onSelect: (slot: string) => void
}

export default function TimeSlots({ slots, selected, loading, onSelect }: TimeSlotsProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border shadow-sm flex justify-center">
        <Loading />
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border shadow-sm text-center">
        <div className="text-4xl mb-2">😔</div>
        <p className="text-gray-500">این روز ساعت خالی ندارد</p>
      </div>
    )
  }

  const morning = slots.filter((s) => parseInt(s.split(":")[0]) < 12)
  const afternoon = slots.filter((s) => parseInt(s.split(":")[0]) >= 12)

  return (
    <div className="bg-white rounded-2xl p-4 border shadow-sm space-y-4">
      <p className="font-semibold text-gray-700">انتخاب ساعت</p>

      {morning.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-2">🌅 صبح</p>
          <div className="grid grid-cols-4 gap-2">
            {morning.map((slot) => (
              <button
                key={slot}
                onClick={() => onSelect(slot)}
                className={`py-2 rounded-xl text-sm font-medium transition-all ${
                  selected === slot
                    ? "bg-pink-500 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-pink-50"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      {afternoon.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-2">🌇 بعدازظهر</p>
          <div className="grid grid-cols-4 gap-2">
            {afternoon.map((slot) => (
              <button
                key={slot}
                onClick={() => onSelect(slot)}
                className={`py-2 rounded-xl text-sm font-medium transition-all ${
                  selected === slot
                    ? "bg-pink-500 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-pink-50"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}