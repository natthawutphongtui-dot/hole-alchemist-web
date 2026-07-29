import Link from "next/link"
import Image from "next/image"
import { Camera, AtSign, Play, ArrowUpRight } from "lucide-react"
import styles from "./Footer.module.css"

const shopLinks = [
  { label: "สินค้าทั้งหมด", href: "/products" },
  { label: "มาใหม่", href: "/products?sort=new" },
  { label: "ขายดี", href: "/products?sort=popular" },
  { label: "ตะกร้า", href: "/cart" },
]

const supportLinks = [
  { label: "ติดตามออเดอร์", href: "/orders" },
  { label: "การจัดส่ง", href: "/shipping" },
  { label: "คืนสินค้า", href: "/returns" },
  { label: "ติดต่อเรา", href: "/contact" },
]

const socials = [
  { label: "Instagram", href: "https://instagram.com", icon: Camera },
  { label: "Twitter", href: "https://twitter.com", icon: AtSign },
  { label: "Youtube", href: "https://youtube.com", icon: Play },
]

export default function Footer() {
  return (
    <footer className={`${styles.sigilFooter} relative mt-auto`}>
      {/* oversized watermark — subtle, clipped at the bottom edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-24 items-end justify-center overflow-hidden">
        <span
          aria-hidden="true"
          className="block translate-y-[35%] select-none whitespace-nowrap font-mono text-[13vw] font-black uppercase leading-none tracking-tighter text-bone-100/[0.03]"
        >
          ALCHEMIST
        </span>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand + newsletter */}
          <div className="md:col-span-5">
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="relative flex h-11 w-11 items-center justify-center">
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

            <p className="mt-6 max-w-sm text-pretty text-sm leading-relaxed text-bone-400">
              Dark streetwear forged for those who turn the void into gold. รับข่าวสารคอลเลกชันใหม่และดรอปสุดพิเศษก่อนใคร
            </p>

            {/* Newsletter */}
            <form className="mt-6 flex max-w-sm items-center gap-2">
              <label htmlFor="newsletter-email" className="sr-only">
                อีเมลของคุณ
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="your@email.com"
                className={`${styles.newsletterInput} h-11 flex-1 rounded-full px-5 text-sm text-bone-100 placeholder:text-bone-500 focus:outline-none`}
              />
              <button type="submit" aria-label="สมัครรับข่าวสาร" className={`${styles.newsletterButton} flex h-11 w-11 shrink-0 items-center justify-center rounded-full`}>
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" strokeWidth={2} />
              </button>
            </form>
          </div>

          {/* Link columns */}
          <div className="md:col-span-3">
            <FooterColumn title="ร้านค้า" links={shopLinks} />
          </div>
          <div className="md:col-span-2">
            <FooterColumn title="ช่วยเหลือ" links={supportLinks} />
          </div>

          {/* Socials */}
          <div className="md:col-span-2">
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-bone-500">
              ติดตาม
            </h3>
            <div className="mt-5 flex gap-2.5">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`${styles.socialIcon} flex h-10 w-10 items-center justify-center rounded-full text-bone-400`}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-copper-500/10 pt-8 sm:flex-row">
          <p className="font-mono text-xs uppercase tracking-widest text-bone-500">
            © 2026 Hole Alchemist · สงวนลิขสิทธิ์
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs uppercase tracking-widest text-bone-500 transition-colors hover:text-bone-200">
              ความเป็นส่วนตัว
            </Link>
            <Link href="/terms" className="text-xs uppercase tracking-widest text-bone-500 transition-colors hover:text-bone-200">
              เงื่อนไข
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-bone-500">{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="group inline-flex items-center text-sm text-bone-400 transition-colors hover:text-bone-100">
              <span className="relative">
                {link.label}
                <span className={`${styles.drip} absolute -bottom-0.5 left-0`} aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}