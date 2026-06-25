"use client"

import { useRef, useState } from "react"
import { getCurrentUser } from "@/lib/firebase/auth"
import { createOrder } from "@/lib/firebase/orders"
import CanvasEditor from "@/components/designer/CanvasEditor"
import ColorPicker from "@/components/designer/ColorPicker"
import FabricSelector from "@/components/designer/FabricSelector"
import { createSubmission } from "@/lib/firebase/submissions"
import { Toast } from "@/components/ui/Toast"
import { useToast } from "@/hooks/useToast"
import ThreeDPreview from "@/components/designer/ThreeDPreview"

const SHIRT_COLORS = [
  { name: "ขาว", value: "#FFFFFF" },
  { name: "ดำ", value: "#1a1a1a" },
  { name: "เทา", value: "#9ca3af" },
  { name: "น้ำเงิน", value: "#1d4ed8" },
  { name: "แดง", value: "#dc2626" },
  { name: "เขียว", value: "#16a34a" },
]

const FABRICS = [
  { name: "Cotton 100%", desc: "นุ่ม ระบายอากาศดี" },
  { name: "Polyester", desc: "เบา แห้งเร็ว" },
  { name: "Cotton/Poly", desc: "ผสม ทนทาน" },
]

const VIEWS = ["หน้า", "หลัง", "ซ้าย", "ขวา"]
const PRICE = 690

export default function DesignPage() {
  const [shirtColor, setShirtColor] = useState("#FFFFFF")
  const [fabric, setFabric] = useState("Cotton 100%")
  const [activeView, setActiveView] = useState("หน้า")
  const [size, setSize] = useState("M")
  const [ordering, setOrdering] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [note, setNote] = useState("")
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({})
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const { toast, showToast, hideToast } = useToast()
  const canvasRef = useRef<any>(null)

  const exportAndUpload = async () => {
    const allViews = await canvasRef.current?.exportAllViews() ?? {}
    const uploadedUrls: Record<string, string> = {}
    for (const [view, dataUrl] of Object.entries(allViews) as [string, string][]) {
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], `design-${view}.png`, { type: "image/png" })
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      uploadedUrls[view] = data.url
    }
    return uploadedUrls
  }

  const handlePreview3D = async () => {
    setLoadingPreview(true)
    try {
      const allViews = await canvasRef.current?.exportAllViews() ?? {}
      setPreviewUrls(allViews)
      setShowPreview(true)
    } finally {
      setLoadingPreview(false)
    }
  }

  const handleOrder = async () => {
    setOrdering(true)
    try {
      const designUrls = await exportAndUpload()
      const designUrl = designUrls["หน้า"] ?? Object.values(designUrls)[0] ?? ""
      const user = await new Promise<any>((resolve) => {
        const unsub = getCurrentUser((u) => { unsub(); resolve(u) })
      })
      const orderId = await createOrder({
        userId: user?.uid ?? "guest",
        items: [{
          productId: "custom-design",
          name: "เสื้อ Custom Design",
          price: PRICE,
          image: designUrl,
          color: shirtColor,
          size,
          quantity: 1,
        }],
        totalPrice: PRICE,
        status: "pending",
        shippingAddress: {
          fullName: "",
          phone: "",
          address: "",
          district: "",
          province: "",
          zipCode: "",
        },
        createdAt: new Date(),
        // @ts-ignore
        designUrls,
        fabric,
        isCustom: true,
      })
      window.location.href = `/checkout?orderId=${orderId}&custom=true`
    } catch (err) {
      console.error(err)
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่")
    } finally {
      setOrdering(false)
    }
  }

  const handleSubmitDesign = async () => {
    setSubmitting(true)
    try {
      const designUrls = await exportAndUpload()
      const designUrl = designUrls["หน้า"] ?? Object.values(designUrls)[0] ?? ""
      const user = await new Promise<any>((resolve) => {
        const unsub = getCurrentUser((u) => { unsub(); resolve(u) })
      })
      await createSubmission({
        userId: user?.uid ?? "guest",
        displayName: user?.displayName ?? "ไม่ระบุ",
        designUrl,
        // @ts-ignore
        designUrls,
        shirtColor,
        fabric,
        note,
        status: "pending",
        createdAt: new Date(),
      })
      setShowNoteModal(false)
      setNote("")
      showToast("เสนอลายสำเร็จแล้ว! ทางร้านจะตรวจสอบเร็วๆ นี้ 🎨")
    } catch {
      showToast("เกิดข้อผิดพลาด กรุณาลองใหม่", "error")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">ออกแบบเสื้อของคุณ</h1>
          <p className="text-gray-500 mt-1">วางข้อความและโลโก้ได้เลย</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <div className="lg:col-span-1 flex flex-col gap-4">
            <ColorPicker colors={SHIRT_COLORS} selected={shirtColor} onChange={setShirtColor} />
            <FabricSelector fabrics={FABRICS} selected={fabric} onChange={setFabric} />
          </div>

          <div className="lg:col-span-2">
            <div className="flex gap-2 mb-4">
              {VIEWS.map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeView === view
                      ? "bg-black text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
            <CanvasEditor ref={canvasRef} shirtColor={shirtColor} view={activeView} />
          </div>

          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">สรุปการออกแบบ</h3>
              <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>สีเสื้อ</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: shirtColor }} />
                    <span>{SHIRT_COLORS.find(c => c.value === shirtColor)?.name}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>เนื้อผ้า</span>
                  <span className="font-medium">{fabric}</span>
                </div>
                <div className="flex justify-between">
                  <span>ราคา</span>
                  <span className="font-bold text-gray-900">฿{PRICE.toLocaleString()}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">ไซส์</p>
                <div className="flex gap-2 flex-wrap">
                  {["S", "M", "L", "XL", "XXL"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`w-10 h-10 rounded-xl border font-semibold text-sm transition-all ${
                        size === s
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handlePreview3D}
                  disabled={loadingPreview}
                  className="w-full border border-gray-200 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {loadingPreview ? "กำลังโหลด..." : "👁️ ดู 3D Preview"}
                </button>
                <button
                  onClick={handleOrder}
                  disabled={ordering}
                  className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {ordering ? "กำลังดำเนินการ..." : "สั่งซื้อเสื้อนี้"}
                </button>
                <button
                  onClick={() => setShowNoteModal(true)}
                  className="w-full border border-gray-200 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  เสนอขายลายให้ร้าน
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3D Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">3D Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>
            <ThreeDPreview shirtColor={shirtColor} designUrls={previewUrls} />
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-2">เสนอขายลายให้ร้าน</h2>
            <p className="text-sm text-gray-500 mb-4">ถ้าทางร้านชอบลายของคุณ เราจะนำไปวางขายในร้านและติดต่อกลับ</p>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">หมายเหตุ (ถ้ามี)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="เช่น แรงบันดาลใจจากอะไร ต้องการค่าตอบแทนเท่าไหร่ ฯลฯ"
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowNoteModal(false)}
                className="flex-1 border border-gray-200 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSubmitDesign}
                disabled={submitting}
                className="flex-1 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {submitting ? "กำลังส่ง..." : "เสนอขาย"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}