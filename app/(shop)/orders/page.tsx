"use client"

import { useEffect, useState } from "react"
import { getOrdersByUser } from "@/lib/firebase/orders"
import { getCurrentUser } from "@/lib/firebase/auth"
import { Order } from "@/types"
import Link from "next/link"

const statusLabel: Record<Order["status"], string> = {
  pending: "รอดำเนินการ",
  confirmed: "ยืนยันแล้ว",
  shipping: "กำลังจัดส่ง",
  delivered: "จัดส่งแล้ว",
  cancelled: "ยกเลิก",
}

const statusColor: Record<Order["status"], string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipping: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = getCurrentUser(async (firebaseUser) => {
      if (!firebaseUser) return
      const data = await getOrdersByUser(firebaseUser.uid)
      setOrders(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="animate-pulse flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-32" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ประวัติออเดอร์</h1>
          <p className="text-gray-500">ติดตามสถานะการสั่งซื้อของคุณ</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {orders.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-gray-500 font-medium text-lg mb-2">ยังไม่มีออเดอร์</p>
            <p className="text-gray-400 text-sm mb-8">เริ่มช้อปปิ้งได้เลย!</p>
            <Link href="/products"
              className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors">
              ดูสินค้าทั้งหมด
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-400 font-mono mb-1">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} รายการ · ฿{order.totalPrice.toLocaleString()}
                      </p>
                    </div>
                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${statusColor[order.status]}`}>
                      {statusLabel[order.status]}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    {order.items.map((item) => (
                      <div key={`${item.productId}-${item.color}-${item.size}`}
                        className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded-lg" />
                        ) : (
                          <span className="text-xl">👕</span>
                        )}
                        <div>
                          <p className="text-xs font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-400">{item.size} · x{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end mt-4">
                    <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                      ดูรายละเอียด →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}