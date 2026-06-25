"use client"

import { useEffect, useState } from "react"
import { getAllOrders, updateOrderStatus } from "@/lib/firebase/orders"
import { Order } from "@/types"

const statusOptions: Order["status"][] = [
  "pending",
  "confirmed",
  "shipping",
  "delivered",
  "cancelled",
]

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Order | null>(null)

  const fetchOrders = async () => {
    const data = await getAllOrders()
    setOrders(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId: string, status: Order["status"]) => {
    await updateOrderStatus(orderId, status)
    fetchOrders()
    if (selected?.id === orderId) {
      setSelected((prev) => prev ? { ...prev, status } : null)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">จัดการออเดอร์</h1>

      {loading ? (
        <p className="text-gray-500">กำลังโหลด...</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">หมายเลขออเดอร์</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">ลูกค้า</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">สินค้า</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">ยอดรวม</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">สถานะ</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-xs font-mono text-gray-500">{order.id.slice(0, 8)}...</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
                    <p className="text-xs text-gray-400">{order.shippingAddress.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">
                      {order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    ฿{order.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[order.status]}`}>
                      {statusLabel[order.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelected(order)}
                      className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      จัดการ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-1">รายละเอียดออเดอร์</h2>
            <p className="text-xs text-gray-400 font-mono mb-6">{selected.id}</p>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">ที่อยู่จัดส่ง</p>
              <p className="text-sm text-gray-600">{selected.shippingAddress.fullName}</p>
              <p className="text-sm text-gray-500">{selected.shippingAddress.phone}</p>
              <p className="text-sm text-gray-500">
                {selected.shippingAddress.address} {(selected.shippingAddress as any).subdistrict} {selected.shippingAddress.district} {selected.shippingAddress.province} {selected.shippingAddress.zipCode}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">สินค้า</p>
              {selected.items.map((item) => (
                <div key={`${item.productId}-${item.color}-${item.size}`} className="flex justify-between text-sm py-1">
                  <span className="text-gray-600">{item.name} x{item.quantity} ({item.size})</span>
                  <span className="font-medium">฿{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-100 mt-2">
                <span>ยอดรวม</span>
                <span>฿{selected.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">อัปเดตสถานะ</p>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(selected.id, status)}
                    className={`py-2 px-4 rounded-xl text-sm font-medium border transition-colors ${
                      selected.status === status
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {statusLabel[status]}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="w-full border border-gray-200 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  )
}