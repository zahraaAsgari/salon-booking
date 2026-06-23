/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// لغو نوبت
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json()

    const appointment = await prisma.appointment.update({
      where: { id: params.id },
      data: { status },
      include: {
        user: true,
        service: true,
        staff: true,
      },
    })

    return NextResponse.json(appointment)
  } catch (error) {
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    )
  }
}

// حذف نوبت
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.appointment.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "نوبت حذف شد" })
  } catch (error) {
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    )
  }
}