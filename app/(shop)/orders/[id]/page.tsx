"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getOrderById } from "@/lib/firebase/orders"
import { Order } from "@/types"
import Link from "next/link"
import { Toast } from "@/components/ui/Toast"
import { useToast } from "@/hooks/useToast"

export default function OrderConfirmPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast, showToast, hideToast } = useToast()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id as string)
        setOrder(data)
        showToast("สั่งซื้อสำเร็จแล้ว! 🎉")
      } catch {
        console.error("โหลด order ไม่สำเร็จ")
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  if (loading) return <div className="text-center py-24">กำลังโหลด...</div>
  if (!order) return <div className="text-center py-24">ไม่พบคำสั่งซื้อ</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">สั่งซื้อสำเร็จ!</h1>
      <p className="text-gray-500 mb-8">ขอบคุณที่ใช้บริการ เราจะจัดส่งสินค้าให้เร็วที่สุด</p>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 text-left mb-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-900">รายละเอียดคำสั่งซื้อ</h2>
          <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
            รอดำเนินการ
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          หมายเลขคำสั่งซื้อ: <span className="font-medium text-gray-900">{id as string}</span>
        </p>

        <div className="flex flex-col gap-2 mb-4">
          {order.items.map((item) => (
            <div key={`${item.productId}-${item.color}-${item.size}`} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.name} x{item.quantity}</span>
              <span className="font-medium">฿{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4 flex justify-between">
          <span className="font-bold text-gray-900">ยอดรวม</span>
          <span className="font-bold text-xl">฿{order.totalPrice.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8">
        <h2 className="font-bold text-gray-900 mb-3">ที่อยู่จัดส่ง</h2>
        <p className="text-sm text-gray-700">{order.shippingAddress.fullName}</p>
        <p className="text-sm text-gray-500">{order.shippingAddress.phone}</p>
        <p className="text-sm text-gray-500">
          {order.shippingAddress.address} {(order.shippingAddress as any).subdistrict} {order.shippingAddress.district} {order.shippingAddress.province} {order.shippingAddress.zipCode}
        </p>
      </div>

      <Link
        href="/products"
        className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors inline-block"
      >
        ช้อปต่อ
      </Link>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}