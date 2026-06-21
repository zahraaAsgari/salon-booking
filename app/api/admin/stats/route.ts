import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const [total, pending, confirmed, todayResult, revenueResult] =
      await Promise.all([
        db.query(`SELECT COUNT(*) FROM "Appointment"`),
        db.query(`SELECT COUNT(*) FROM "Appointment" WHERE status = 'PENDING'`),
        db.query(`SELECT COUNT(*) FROM "Appointment" WHERE status = 'CONFIRMED'`),
        db.query(
          `SELECT COUNT(*) FROM "Appointment" 
           WHERE date::date = CURRENT_DATE AND status != 'CANCELLED'`
        ),
        db.query(
          `SELECT COALESCE(SUM("totalPrice"), 0) as revenue 
           FROM "Appointment" WHERE status = 'COMPLETED'`
        ),
      ])

    return NextResponse.json({
      total: parseInt(total.rows[0].count),
      pending: parseInt(pending.rows[0].count),
      confirmed: parseInt(confirmed.rows[0].count),
      today: parseInt(todayResult.rows[0].count),
      revenue: parseInt(revenueResult.rows[0].revenue),
    })
  } catch (error) {
    console.error("خطا:", error)
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}