export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"

export type UserRole = "CUSTOMER" | "ADMIN"

export interface ServiceInfo {
  id: string
  name: string
  price: number
  duration: number
  description?: string
}

export interface StaffInfo {
  id: string
  name: string
  specialty: string
  avatar?: string
}

export interface AppointmentInfo {
  id: string
  date: Date
  status: AppointmentStatus
  totalPrice: number
  notes?: string
  service: ServiceInfo
  staff: StaffInfo
}

export interface TimeSlot {
  time: string
  available: boolean
}