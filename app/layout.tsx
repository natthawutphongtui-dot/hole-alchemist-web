import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "T-Shirt Shop",
  description: "ร้านขายเสื้อออนไลน์",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Line+Seed+Sans+TH:wght@300;400;700&family=Kanit:wght@400;700&family=Sarabun:wght@400;700&family=Prompt:wght@400;700&family=Mitr:wght@400;700&family=Chakra+Petch:wght@400;700&family=IBM+Plex+Sans+Thai:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}