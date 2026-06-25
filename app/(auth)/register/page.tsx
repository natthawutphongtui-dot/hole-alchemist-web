"use client"

import { useState } from "react"
import { registerWithEmail } from "@/lib/firebase/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async () => {
    if (!displayName || !email || !password || !confirmPassword)
      return setError("กรุณากรอกข้อมูลให้ครบ")
    if (password !== confirmPassword)
      return setError("รหัสผ่านไม่ตรงกัน")
    if (password.length < 6)
      return setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")

    setLoading(true)
    setError("")
    try {
      await registerWithEmail(email, password, displayName)
      router.push("/products")
    } catch {
      setError("ไม่สามารถสมัครสมาชิกได้ อีเมลนี้อาจถูกใช้แล้ว")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">สมัครสมาชิก</h1>
          <p className="text-gray-500 mt-2">สร้างบัญชีใหม่</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">ชื่อ</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="ชื่อของคุณ"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">อีเมล</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">รหัสผ่าน</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="อย่างน้อย 6 ตัวอักษร"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">ยืนยันรหัสผ่าน</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            มีบัญชีแล้ว?{" "}
            <Link href="/login" className="text-black font-semibold hover:underline">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}