"use client"

import { useEffect, useState } from "react"
import { getAllSubmissions, updateSubmissionStatus, Submission } from "@/lib/firebase/submissions"
import { addProduct } from "@/lib/firebase/products"

const statusLabel: Record<Submission["status"], string> = {
    pending: "รอตรวจสอบ",
    approved: "อนุมัติแล้ว",
    rejected: "ปฏิเสธแล้ว",
}

const statusColor: Record<Submission["status"], string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
}

export default function AdminDesignsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<Submission | null>(null)
    const [approving, setApproving] = useState(false)
    const [productForm, setProductForm] = useState({
        name: "",
        price: 690,
        category: "limited",
    })

    const fetchSubmissions = async () => {
        const data = await getAllSubmissions()
        setSubmissions(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchSubmissions()
    }, [])

    const handleReject = async (id: string) => {
        if (!confirm("ปฏิเสธลายนี้?")) return
        await updateSubmissionStatus(id, "rejected")
        fetchSubmissions()
        setSelected(null)
    }

    const handleApprove = async () => {
        if (!selected) return
        if (!productForm.name) return alert("กรุณากรอกชื่อสินค้า")
        setApproving(true)
        try {
            await addProduct({
                name: productForm.name,
                description: `ลายจากดีไซเนอร์ ${selected.displayName}`,
                price: productForm.price,
                images: [selected.designUrl],
                colors: [selected.shirtColor],
                sizes: ["S", "M", "L", "XL", "XXL"],
                stock: 999,
                category: productForm.category,
                createdAt: new Date(),
            })
            await updateSubmissionStatus(selected.id, "approved")
            setSelected(null)
            fetchSubmissions()
            alert("อนุมัติและเพิ่มสินค้าเรียบร้อย!")
        } catch {
            alert("เกิดข้อผิดพลาด")
        } finally {
            setApproving(false)
        }
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">ลายที่เสนอขาย</h1>

            {loading ? (
                <p className="text-gray-500">กำลังโหลด...</p>
            ) : submissions.length === 0 ? (
                <div className="text-center py-24">
                    <p className="text-5xl mb-4"></p>
                    <p className="text-gray-500">ยังไม่มีลายที่เสนอมา</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {submissions.map((sub) => (
                        <div key={sub.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                            <div className="aspect-square bg-gray-50 relative">
                                {sub.designUrl ? (
                                    <img src={sub.designUrl} alt="design" className="w-full h-full object-contain p-4" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-5xl"></div>
                                )}
                                <span className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-medium ${statusColor[sub.status]}`}>
                                    {statusLabel[sub.status]}
                                </span>
                            </div>
                            <div className="p-4">
                                <p className="font-semibold text-gray-900">{sub.displayName}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500">สีเสื้อ</span>
                                    <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: sub.shirtColor }} />
                                    <span className="text-xs text-gray-500">· {sub.fabric}</span>
                                </div>
                                {sub.note && (
                                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">{sub.note}</p>
                                )}
                                {sub.status === "pending" && (
                                    <button
                                        onClick={() => {
                                            setSelected(sub)
                                            setProductForm({ name: "", price: 690, category: "limited" })
                                        }}
                                        className="mt-4 w-full bg-black text-white py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
                                    >
                                        ตรวจสอบ
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selected && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">ตรวจสอบลาย</h2>

                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                            {/* แสดงทุก view */}
                            {(selected as any).designUrls ? (
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    {Object.entries((selected as any).designUrls).map(([view, url]) => (
                                        <div key={view} className="text-center">
                                            <img src={url as string} alt={view} className="w-full h-32 object-contain bg-white rounded-lg border border-gray-100" />
                                            <p className="text-xs text-gray-500 mt-1">{view}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : selected.designUrl ? (
                                <img src={selected.designUrl} alt="design" className="w-full h-48 object-contain mb-3" />
                            ) : null}
                            <p className="text-sm font-medium text-gray-900">{selected.displayName}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: selected.shirtColor }} />
                                <span className="text-xs text-gray-500">{selected.fabric}</span>
                            </div>
                            {selected.note && (
                                <p className="text-sm text-gray-500 mt-2">{selected.note}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 mb-6">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">ชื่อสินค้า (สำหรับวางขาย)</label>
                                <input
                                    type="text"
                                    value={productForm.name}
                                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                    placeholder="เช่น Limited Edition — ลาย Tree of Life"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">ราคา (฿)</label>
                                    <input
                                        type="number"
                                        value={productForm.price}
                                        onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">หมวดหมู่</label>
                                    <select
                                        value={productForm.category}
                                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                                    >
                                        <option value="limited">limited</option>
                                        <option value="basic">basic</option>
                                        <option value="premium">premium</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handleReject(selected.id)}
                                className="flex-1 border border-red-200 text-red-500 py-3 rounded-xl font-medium hover:bg-red-50 transition-colors"
                            >
                                ปฏิเสธ
                            </button>
                            <button
                                onClick={() => setSelected(null)}
                                className="flex-1 border border-gray-200 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={approving}
                                className="flex-1 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {approving ? "กำลังอนุมัติ..." : "อนุมัติ + วางขาย"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}