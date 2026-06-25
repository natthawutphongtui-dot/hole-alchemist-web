"use client"

import { useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/firebase/auth"
import { db } from "@/lib/firebase/config"
import { doc, getDoc, setDoc } from "firebase/firestore"
import type { User } from "firebase/auth"

interface ProfileData {
  fullName: string
  phone: string
  address: string
  district: string
  subdistrict: string
  province: string
  zipCode: string
}

const defaultProfile: ProfileData = {
  fullName: "",
  phone: "",
  address: "",
  district: "",
  subdistrict: "",
  province: "",
  zipCode: "",
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [form, setForm] = useState<ProfileData>(defaultProfile)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const unsubscribe = getCurrentUser(async (firebaseUser) => {
      if (!firebaseUser) {
        window.location.href = "/login"
        return
      }
      setUser(firebaseUser)
      const snap = await getDoc(doc(db, "users", firebaseUser.uid))
      if (snap.exists()) {
        const data = snap.data()
        setForm({
          fullName: data.fullName ?? "",
          phone: data.phone ?? "",
          address: data.address ?? "",
          district: data.district ?? "",
          subdistrict: data.subdistrict ?? "",
          province: data.province ?? "",
          zipCode: data.zipCode ?? "",
        })
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      await setDoc(doc(db, "users", user.uid), form, { merge: true })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      alert("บันทึกไม่สำเร็จ กรุณาลองใหม่")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-24">กำลังโหลด...</div>

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
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">โปรไฟล์ของฉัน</h1>
      <p className="text-gray-500 mb-8">{user?.email}</p>

      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6">ข้อมูลส่วนตัวและที่อยู่</h2>
        <div className="grid grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.name} className={field.col === 2 ? "col-span-2" : "col-span-1"}>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{field.label}</label>
              <input
                type="text"
                name={field.name}
                value={form[field.name as keyof ProfileData]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {saving ? "กำลังบันทึก..." : saved ? "✓ บันทึกแล้ว" : "บันทึกข้อมูล"}
        </button>
      </div>
    </div>
  )
}