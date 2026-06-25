"use client"

import { useCartStore } from "@/store/cartStore"
import Link from "next/link"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <p className="text-xl font-semibold text-gray-700 mb-2">ตะกร้าของคุณว่างเปล่า</p>
        <p className="text-gray-400 mb-8">เลือกสินค้าที่ชอบแล้วเพิ่มลงตะกร้าได้เลย</p>
        <Link href="/products" className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors">
          ดูสินค้าทั้งหมด
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">ตะกร้าสินค้า</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div key={`${item.productId}-${item.color}-${item.size}`} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4">
              <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" /> : "👕"}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <div className="flex gap-2 mt-1">
                  <span className="text-sm text-gray-500">สี:</span>
                  <div className="w-4 h-4 rounded-full border border-gray-200 mt-0.5" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-500 ml-2">ไซส์: {item.size}</span>
                </div>
                <p className="font-bold text-gray-900 mt-1">฿{item.price.toLocaleString()}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.productId, item.color, item.size)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  ✕
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.color, item.size, Math.max(1, item.quantity - 1))}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-sm"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-4">สรุปคำสั่งซื้อ</h2>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">ราคารวม</span>
            <span className="font-medium">฿{totalPrice().toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-600">ค่าจัดส่ง</span>
            <span className="font-medium text-green-600">ฟรี</span>
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between mb-6">
            <span className="font-bold text-gray-900">ยอดรวมทั้งหมด</span>
            <span className="font-bold text-xl">฿{totalPrice().toLocaleString()}</span>
          </div>
          <Link href="/checkout" className="block w-full bg-black text-white py-3 rounded-xl font-semibold text-center hover:bg-gray-800 transition-colors">
            ดำเนินการสั่งซื้อ
          </Link>
        </div>
      </div>
    </div>
  )
}