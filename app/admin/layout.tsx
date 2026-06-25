"use client"

import { useEffect, useState } from "react"
import { getCurrentUser, getUserDocument } from "@/lib/firebase/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Shirt,
  Package,
  Palette,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const unsubscribe = getCurrentUser(async (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login")
        return
      }
      const userDoc = await getUserDocument(firebaseUser.uid)
      if (userDoc?.role !== "admin") {
        router.push("/")
        return
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [router])

  if (loading) return <div className="text-center py-24">กำลังตรวจสอบสิทธิ์...</div>

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "จัดการสินค้า", icon: Shirt },
    { href: "/admin/orders", label: "จัดการออเดอร์", icon: Package },
    { href: "/admin/designs", label: "ลายที่เสนอขาย", icon: Palette },
  ]

  return (
    <div className="min-h-screen flex">
      <aside className={`${sidebarOpen ? "w-60" : "w-16"} bg-gray-900 text-white flex flex-col transition-all duration-300 flex-shrink-0`}>
        <div className="p-4 border-b border-gray-700 flex items-center justify-between h-16">
          {sidebarOpen && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Admin Panel</p>
              <p className="font-bold">Hole Alchemist</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800 ml-auto flex-shrink-0"
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <nav className="flex flex-col p-2 gap-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                title={!sidebarOpen ? item.label : undefined}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm font-medium"
              >
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-2 border-t border-gray-700">
          <Link
            href="/"
            title={!sidebarOpen ? "กลับหน้าร้าน" : undefined}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm"
          >
            <ArrowLeft size={18} className="flex-shrink-0" />
            {sidebarOpen && <span>กลับหน้าร้าน</span>}
          </Link>
        </div>
      </aside>

      <main className="flex-1 bg-gray-50 overflow-auto">
        {children}
      </main>
    </div>
  )
}