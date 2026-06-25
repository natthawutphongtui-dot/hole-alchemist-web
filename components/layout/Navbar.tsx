"use client"

import Link from "next/link"
import { useCartStore } from "@/store/cartStore"
import { useEffect, useState } from "react"
import { getCurrentUser, logout, getUserDocument } from "@/lib/firebase/auth"
import type { User } from "firebase/auth"
import Image from "next/image"

export default function Navbar() {
  const totalItems = useCartStore((state) => state.totalItems)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setMounted(true)
    const unsubscribe = getCurrentUser(async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const userDoc = await getUserDocument(firebaseUser.uid)
        setIsAdmin(userDoc?.role === "admin")
      } else {
        setIsAdmin(false)
      }
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await logout()
    setUser(null)
    setIsAdmin(false)
  }

  return (
    
    <nav className="sticky top-0 z-50 bg-white/75 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        
        <Link href="/" className="flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.02]">
          <div className="relative overflow-hidden rounded-full bg-gray-50 p-1 border border-gray-100 group-hover:border-black/10 transition-colors">
            <Image 
              src="/logohac.png" 
              alt="HOLE ALCHEMIST" 
              width={60} 
              height={60} 
              className="object-contain filter drop-shadow-sm group-hover:rotate-12 transition-transform duration-500" 
            />
          </div>
          <span className="text-lg font-black tracking-widest text-black uppercase font-mono">
            HOLE ALCHEMIST
          </span>
        </Link>

        
        <div className="flex items-center gap-8">
          
          <Link href="/products" className="relative text-sm font-medium text-gray-500 hover:text-black transition-colors py-2 group">
            สินค้า
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
          </Link>
          
          
          <Link href="/cart" className="relative text-sm font-medium text-gray-500 hover:text-black transition-colors py-2 group flex items-center gap-1.5">
            <span>ตะกร้า</span>
            {mounted && totalItems() > 0 && (
              <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center transform scale-90 group-hover:scale-100 transition-transform">
                {totalItems()}
              </span>
            )}
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
          </Link>

          
          {mounted && (
            user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    className="text-xs font-semibold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-md hover:bg-amber-100 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                
                <Link href="/orders" className="text-sm font-medium text-gray-500 hover:text-black transition-colors py-2 group relative">
                  ออเดอร์
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
                </Link>

                <Link href="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition-colors">
                  <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 uppercase">
                    {(user.displayName ?? user.email ?? "U").charAt(0)}
                  </div>
                  <span className="max-w-[100px] truncate hidden md:inline">
                    {user.displayName ?? user.email?.split('@')[0]}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-xs font-medium text-gray-400 hover:text-red-600 border border-gray-200 hover:border-red-100 px-3 py-1.5 rounded-lg transition-all"
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              
              <Link 
                href="/login" 
                className="relative inline-flex items-center justify-center text-sm font-medium text-white bg-black px-5 py-2.5 rounded-xl overflow-hidden group transition-all duration-300 hover:bg-zinc-800 hover:shadow-lg hover:shadow-black/5"
              >
                <span>เข้าสู่ระบบ</span>
              </Link>
            )
          )}
        </div>

      </div>
    </nav>
  )
}