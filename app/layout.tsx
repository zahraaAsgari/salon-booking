import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: "سالن زیبایی نیلوفر",
  description: "سیستم رزرو آنلاین نوبت",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "Vazirmatn, sans-serif" }}>
        <Navbar/>
        {children}</body>
    </html>
  )
}