"use client"

import { Suspense, useState, useEffect } from "react"
import { useCartStore } from "@/store/cartStore"
import { createOrder } from "@/lib/firebase/orders"
import { getCurrentUser } from "@/lib/firebase/auth"
import { db } from "@/lib/firebase/config"
import { doc, getDoc } from "firebase/firestore"
import type { User } from "firebase/auth"
import { useRouter, useSearchParams } from "next/navigation"

export default function CheckoutPage() {
    return (
        <Suspense fallback={null}>
            <Checkout />
        </Suspense>
    )
}

interface AddressForm {
    fullName: string
    phone: string
    address: string
    subdistrict: string
    district: string
    province: string
    zipCode: string
}

const emptyForm: AddressForm = {
    fullName: "",
    phone: "",
    address: "",
    subdistrict: "",
    district: "",
    province: "",
    zipCode: "",
}

function Checkout() {
    const searchParams = useSearchParams()
    const isCustom = searchParams.get("custom") === "true"
    const customOrderId = searchParams.get("orderId")
    const router = useRouter()
    const { items, totalPrice, clearCart } = useCartStore()
    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [savedAddress, setSavedAddress] = useState<AddressForm | null>(null)
    const [useDefault, setUseDefault] = useState(false)
    const [form, setForm] = useState<AddressForm>(emptyForm)


    useEffect(() => {
        setMounted(true)
        const unsubscribe = getCurrentUser(async (firebaseUser) => {
            setUser(firebaseUser)
            if (firebaseUser) {
                const snap = await getDoc(doc(db, "users", firebaseUser.uid))
                if (snap.exists()) {
                    const data = snap.data()
                    const address: AddressForm = {
                        fullName: data.fullName ?? "",
                        phone: data.phone ?? "",
                        address: data.address ?? "",
                        subdistrict: data.subdistrict ?? "",
                        district: data.district ?? "",
                        province: data.province ?? "",
                        zipCode: data.zipCode ?? "",
                    }
                    const hasAddress = Object.values(address).some((v) => v !== "")
                    if (hasAddress) {
                        setSavedAddress(address)
                        setUseDefault(true)
                        setForm(address)
                    }
                }
            }
        })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        if (mounted && items.length === 0 && !isCustom) {
            router.push("/cart")
        }
    }, [mounted, items, router, isCustom])

    useEffect(() => {
        if (useDefault && savedAddress) {
            setForm(savedAddress)
        } else if (!useDefault) {
            setForm(emptyForm)
        }
    }, [useDefault, savedAddress])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        const { fullName, phone, address, district, province, zipCode } = form
        if (!fullName || !phone || !address || !district || !province || !zipCode) {
            alert("กรุณากรอกข้อมูลให้ครบ")
            return
        }
        setLoading(true)
        try {
            if (isCustom && customOrderId) {
                // อัปเดต order ที่สร้างไว้แล้วใส่ที่อยู่
                const { updateOrderStatus } = await import("@/lib/firebase/orders")
                await import("firebase/firestore").then(async ({ doc, updateDoc }) => {
                    const { db } = await import("@/lib/firebase/config")
                    await updateDoc(doc(db, "orders", customOrderId), {
                        shippingAddress: form,
                        status: "pending",
                    })
                })
                clearCart()
                window.location.href = `/orders/${customOrderId}`
            } else {
                const orderId = await createOrder({
                    userId: user?.uid ?? "guest",
                    items,
                    totalPrice: totalPrice(),
                    status: "pending",
                    shippingAddress: form,
                    createdAt: new Date(),
                })
                clearCart()
                window.location.href = `/orders/${orderId}`
            }
        } catch {
            alert("เกิดข้อผิดพลาด กรุณาลองใหม่")
        } finally {
            setLoading(false)
        }
    }

    if (!mounted) return null

    const fields = [
        { name: "fullName", label: "ชื่อ-นามสกุล", placeholder: "สมชาย ใจดี", col: 2 },
        { name: "phone", label: "เบอร์โทรศัพท์", placeholder: "08X-XXX-XXXX", col: 1 },
        { name: "address", label: "ที่อยู่", placeholder: "บ้านเลขที่ ถนน ซอย", col: 2 },
        { name: "subdistrict", label: "ตำบล/แขวง", placeholder: "ตำบล", col: 1 },
        { name: "district", label: "อำเภอ/เขต", placeholder: "อำเภอ", col: 1 },
        { name: "province", label: "จังหวัด", placeholder: "จังหวัด", col: 1 },
        { name: "zipCode", label: "รหัสไปรษณีย์", placeholder: "50000", col: 1 },
    ]

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">ชำระเงิน</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-4">

                    {savedAddress && (
                        <div className="bg-white border border-gray-100 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">เลือกที่อยู่จัดส่ง</h2>
                            <div className="flex flex-col gap-3">
                                <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all"
                                    style={{ borderColor: useDefault ? "black" : "#e5e7eb" }}>
                                    <input
                                        type="radio"
                                        checked={useDefault}
                                        onChange={() => setUseDefault(true)}
                                        className="mt-1"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900">ใช้ที่อยู่จากโปรไฟล์</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {savedAddress.fullName} · {savedAddress.phone}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {savedAddress.address} {savedAddress.subdistrict} {savedAddress.district} {savedAddress.province} {savedAddress.zipCode}
                                        </p>
                                    </div>
                                </label>

                                <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all"
                                    style={{ borderColor: !useDefault ? "black" : "#e5e7eb" }}>
                                    <input
                                        type="radio"
                                        checked={!useDefault}
                                        onChange={() => setUseDefault(false)}
                                        className="mt-1"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900">ใช้ที่อยู่ใหม่</p>
                                        <p className="text-sm text-gray-500">กรอกที่อยู่จัดส่งใหม่</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="bg-white border border-gray-100 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">
                            {useDefault ? "ที่อยู่จัดส่ง" : "กรอกที่อยู่จัดส่ง"}
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {fields.map((field) => (
                                <div key={field.name} className={field.col === 2 ? "col-span-2" : "col-span-1"}>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">{field.label}</label>
                                    <input
                                        type="text"
                                        name={field.name}
                                        value={form[field.name as keyof AddressForm]}
                                        onChange={handleChange}
                                        placeholder={field.placeholder}
                                        disabled={useDefault}
                                        className={`w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors ${useDefault ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""
                                            }`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">สรุปคำสั่งซื้อ</h2>
                        <div className="flex flex-col gap-3 mb-4">
                            {items.map((item) => (
                                <div key={`${item.productId}-${item.color}-${item.size}`} className="flex justify-between text-sm">
                                    <span className="text-gray-600">{item.name} x{item.quantity}</span>
                                    <span className="font-medium">฿{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 pt-4 flex justify-between mb-2">
                            <span className="text-gray-600">ค่าจัดส่ง</span>
                            <span className="text-green-600 font-medium">ฟรี</span>
                        </div>
                        <div className="flex justify-between mb-6">
                            <span className="font-bold text-gray-900">ยอดรวม</span>
                            <span className="font-bold text-xl">
                                ฿{isCustom ? "690" : totalPrice().toLocaleString()}
                            </span>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            {loading ? "กำลังดำเนินการ..." : "ยืนยันคำสั่งซื้อ"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}