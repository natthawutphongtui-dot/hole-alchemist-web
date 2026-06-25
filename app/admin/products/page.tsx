"use client"

import { useEffect, useState } from "react"
import { getProducts, addProduct, updateProduct, deleteProduct } from "@/lib/firebase/products"
import { Product } from "@/types"

const emptyForm = {
    name: "",
    description: "",
    price: 0,
    colors: "",
    sizes: "",
    stock: 0,
    category: "",
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState<Product | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>("")
    const [uploading, setUploading] = useState(false)

    const fetchProducts = async () => {
        const data = await getProducts()
        setProducts(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const openAdd = () => {
        setEditing(null)
        setForm(emptyForm)
        setImageFile(null)
        setImagePreview("")
        setShowModal(true)
    }

    const openEdit = (product: Product) => {
        setEditing(product)
        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            colors: product.colors.join(", "),
            sizes: product.sizes.join(", "),
            stock: product.stock,
            category: product.category,
        })
        setImageFile(null)
        setImagePreview(product.images[0] ?? "")
        setShowModal(true)
    }

    const handleSave = async () => {
        if (!form.name || !form.price) return alert("กรุณากรอกชื่อและราคา")
        setSaving(true)
        try {
            let imageUrl = editing?.images[0] ?? ""

            if (imageFile) {
                setUploading(true)
                const formData = new FormData()
                formData.append("file", imageFile)
                const res = await fetch("/api/upload", { method: "POST", body: formData })
                const data = await res.json()
                imageUrl = data.url
                setUploading(false)
            }

            const productData = {
                name: form.name,
                description: form.description,
                price: Number(form.price),
                colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
                sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
                stock: Number(form.stock),
                category: form.category,
                images: imageUrl ? [imageUrl] : [],
                createdAt: editing?.createdAt ?? new Date(),
            }

            if (editing) {
                await updateProduct(editing.id, productData)
            } else {
                await addProduct(productData)
            }
            setShowModal(false)
            fetchProducts()
        } catch {
            alert("บันทึกไม่สำเร็จ")
        } finally {
            setSaving(false)
            setUploading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("ต้องการลบสินค้านี้?")) return
        await deleteProduct(id)
        fetchProducts()
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">จัดการสินค้า</h1>
                <button
                    onClick={openAdd}
                    className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                    + เพิ่มสินค้า
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500">กำลังโหลด...</p>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">สินค้า</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">หมวดหมู่</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">ราคา</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">สต็อก</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">สี</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">ไซส์</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                                                {product.images[0] ? (
                                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                                                ) : "👕"}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                                                <p className="text-xs text-gray-400 truncate max-w-xs">{product.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">{product.category}</span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">฿{product.price.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-gray-600">{product.stock}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1">
                                            {product.colors.slice(0, 5).map((color) => (
                                                <div key={color} className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: color }} />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1 flex-wrap">
                                            {product.sizes.map((size) => (
                                                <span key={size} className="text-xs bg-gray-100 px-2 py-0.5 rounded">{size}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => openEdit(product)}
                                                className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                แก้ไข
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-sm px-3 py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                ลบ
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            {editing ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
                        </h2>
                        <div className="flex flex-col gap-4">
                            {[
                                { key: "name", label: "ชื่อสินค้า", placeholder: "เสื้อ Basic White" },
                                { key: "description", label: "รายละเอียด", placeholder: "เสื้อยืดคอกลม..." },
                                { key: "category", label: "หมวดหมู่", placeholder: "basic, premium, etc." },
                                { key: "colors", label: "สี (คั่นด้วยจุลภาค)", placeholder: "#FFFFFF, #000000, #FF0000" },
                                { key: "sizes", label: "ไซส์ (คั่นด้วยจุลภาค)", placeholder: "S, M, L, XL" },
                            ].map((f) => (
                                <div key={f.key}>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">{f.label}</label>
                                    <input
                                        type="text"
                                        value={form[f.key as keyof typeof form]}
                                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                                        placeholder={f.placeholder}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">รูปสินค้า</label>
                                <div
                                    className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-gray-400 transition-colors cursor-pointer"
                                    onClick={() => document.getElementById("fileInput")?.click()}
                                >
                                    {imagePreview ? (
                                        <div>
                                            <img src={imagePreview} alt="preview" className="w-full h-48 object-cover rounded-lg mb-2" />
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setImagePreview(""); setImageFile(null) }}
                                                className="text-xs text-red-500 hover:underline"
                                            >
                                                ลบรูป
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="py-6">
                                            <p className="text-gray-400 text-sm mb-2">คลิกเพื่อเลือกรูป</p>
                                            <p className="text-gray-300 text-xs">PNG, JPG ขนาดไม่เกิน 5MB</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            setImageFile(file)
                                            setImagePreview(URL.createObjectURL(file))
                                        }
                                    }}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">ราคา (฿)</label>
                                    <input
                                        type="number"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">สต็อก</label>
                                    <input
                                        type="number"
                                        value={form.stock}
                                        onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 border border-gray-200 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || uploading}
                                className="flex-1 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {uploading ? "กำลังอัปโหลดรูป..." : saving ? "กำลังบันทึก..." : "บันทึก"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}