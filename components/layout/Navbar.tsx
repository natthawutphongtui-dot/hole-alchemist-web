"use client"

import Link from "next/link"
import { useCartStore } from "@/store/cartStore"
import { useEffect, useState } from "react"
import { getCurrentUser, logout, getUserDocument } from "@/lib/firebase/auth"
import type { User } from "firebase/auth"
import Image from "next/image"
import { ShoppingBag, LogOut, ShieldCheck, Package } from "lucide-react"
import styles from "./Navbar.module.css"

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

  const count = mounted ? totalItems() : 0

  return (
    <nav className={`${styles.sigilNav} sticky top-0 z-50`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative flex h-12 w-12 items-center justify-center">
            <svg viewBox="0 0 100 100" className={`${styles.sigilRing} absolute inset-0 h-full w-full`} aria-hidden="true">
              <circle cx="50" cy="50" r="46" className={styles.sigilLine} />
              <circle cx="50" cy="50" r="38" className={styles.sigilLine} />
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180
                const x1 = 50 + 42 * Math.cos(angle)
                const y1 = 50 + 42 * Math.sin(angle)
                const x2 = 50 + 46 * Math.cos(angle)
                const y2 = 50 + 46 * Math.sin(angle)
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className={styles.sigilLine} />
              })}
            </svg>
            <Image
              src="/logohac.png"
              alt="HOLE ALCHEMIST"
              width={30}
              height={30}
              className="relative z-10 h-[30px] w-[30px] rounded-full object-cover"
            />
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-mono text-sm font-black uppercase tracking-[0.35em] text-bone-100">
              HOLE
            </span>
            <span className={`${styles.sigilBrandAccent} font-mono text-sm font-black uppercase tracking-[0.35em]`}>
              ALCHEMIST
            </span>
          </div>
        </Link>

        {/* Right cluster */}
        <div className="flex items-center gap-2 sm:gap-4">
          <NavLink href="/products">สินค้า</NavLink>

          <Link
            href="/cart"
            className="group relative flex items-center gap-2 px-3 py-2 text-xs font-medium uppercase tracking-widest text-bone-400 transition-colors hover:text-bone-100"
          >
            <span className="relative">
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {mounted && count > 0 && (
                <span className={`${styles.cartBadge} absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none`}>
                  {count}
                </span>
              )}
            </span>
            <span className="hidden sm:inline">ตะกร้า</span>
          </Link>

          {mounted &&
            (user ? (
              <div className="flex items-center gap-2 border-l border-white/10 pl-2 sm:gap-3 sm:pl-4">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className={`${styles.adminPill} flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}

                <Link
                  href="/orders"
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium uppercase tracking-widest text-bone-400 transition-colors hover:text-bone-100"
                >
                  <Package className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  <span className="hidden md:inline">ออเดอร์</span>
                </Link>

                <Link
                  href="/profile"
                  className="group flex items-center gap-2.5 rounded-full border border-transparent py-1 pl-1 pr-1 transition-colors hover:border-white/10 md:pr-3"
                >
                  <div className={`${styles.avatarRing} flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold uppercase text-bone-100`}>
                    {(user.displayName ?? user.email ?? "U").charAt(0)}
                  </div>
                  <span className="hidden max-w-[110px] truncate text-sm font-medium text-bone-300 transition-colors group-hover:text-bone-100 md:inline">
                    {user.displayName ?? user.email?.split("@")[0]}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  aria-label="ออกจากระบบ"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-bone-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                >
                  <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </button>
              </div>
            ) : (
              <Link href="/login" className={`${styles.ctaButton} relative inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold uppercase tracking-widest`}>
                <span>เข้าสู่ระบบ</span>
              </Link>
            ))}
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative hidden px-3 py-2 text-xs font-medium uppercase tracking-widest text-bone-400 transition-colors hover:text-bone-100 sm:inline-block"
    >
      {children}
      <span className={`${styles.drip} absolute bottom-1 left-3`} aria-hidden="true" />
    </Link>
  )
}