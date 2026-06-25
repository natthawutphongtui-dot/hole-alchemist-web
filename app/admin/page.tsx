"use client"

import { useEffect, useState } from "react"
import { getProducts } from "@/lib/firebase/products"
import { getAllOrders } from "@/lib/firebase/orders"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    pending: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      const [products, orders] = await Promise.all([getProducts(), getAllOrders()])
      setStats({
        products: products.length,
        orders: orders.length,
        revenue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
        pending: orders.filter((o) => o.status === "pending").length,
      })
    }
    fetchStats()
  }, [])

  const cards = [
    { label: "สินค้าทั้งหมด", value: stats.products, icon: "👕", color: "bg-blue-50 text-blue-600" },
    { label: "ออเดอร์ทั้งหมด", value: stats.orders, icon: "📦", color: "bg-green-50 text-green-600" },
    { label: "รายได้รวม", value: `฿${stats.revenue.toLocaleString()}`, icon: "💰", color: "bg-yellow-50 text-yellow-600" },
    { label: "รอดำเนินการ", value: stats.pending, icon: "⏳", color: "bg-red-50 text-red-600" },
  ]

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center text-2xl mb-4`}>
              {card.icon}
            </div>
            <p className="text-gray-500 text-sm">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}