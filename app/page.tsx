"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Palette, Shirt, Truck } from "lucide-react"
import styles from "./Home.module.css"
import cardStyles from "./StackedShirtCards.module.css"

const stats = [
  { value: "500+", label: "ลูกค้าพึงพอใจ" },
  { value: "Cotton 100%", label: "ผ้าคุณภาพดี" },
  { value: "ส่งฟรี", label: "ทั่วประเทศไทย" },
]

const features = [
  {
    icon: Palette,
    title: "ออกแบบเองได้",
    desc: "วางข้อความ โลโก้ เลือกสีและเนื้อผ้าได้ตามใจ พร้อม Preview แบบ 3D",
  },
  {
    icon: Shirt,
    title: "ผ้าคุณภาพพรีเมียม",
    desc: "Cotton 100% เกรด A นุ่ม ระบายอากาศดี สีไม่ตก ทนทานทุกการซัก",
  },
  {
    icon: Truck,
    title: "จัดส่งรวดเร็ว",
    desc: "ส่งฟรีทั่วไทย ติดตามพัสดุได้แบบ real-time ถึงมือใน 3-5 วัน",
  },
]

const SWIPE_THRESHOLD = 90
const MAX_VISIBLE = 4
const heroImages = ["/th-4.jpg", "/th-2.jpg", "/th-3.jpg", "/th-1.jpg"]

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero — sized to fill the first screen under the navbar */}
      <section className={`${styles.hero} relative flex items-center overflow-hidden`}>
        <div className={`${styles.heroGlow} absolute inset-0`} />
        <div
          className={`${styles.sigilWatermark} pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px]`}
          aria-hidden="true"
        />

        <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 md:grid-cols-2 md:gap-16">
          <div>
            <span className={`${styles.eyebrow} mb-6 inline-block rounded-full px-4 py-2 font-mono text-xs font-medium uppercase tracking-widest`}>
              Premium T-Shirt
            </span>
            <h1 className="mb-6 text-5xl font-bold leading-tight text-bone-100 md:text-6xl">
              เสื้อยืดที่
              <br />
              <span className={styles.accentText}>ออกแบบเอง</span>
              <br />
              ได้เลย
            </h1>
            <p className="mb-8 max-w-md text-lg leading-relaxed text-bone-400">
              เลือกสี เลือกเนื้อผ้า วางโลโก้และข้อความได้เอง
              <br />
              ดู Preview แบบ 3D ก่อนสั่งซื้อ
            </p>

            <div className="mb-10 flex flex-wrap gap-4">
              <Link href="/products" className={`${styles.primaryButton} rounded-2xl px-8 py-4 font-bold`}>
                <span>ดูสินค้าทั้งหมด</span>
              </Link>
              <Link href="/design" className={`${styles.outlineButton} rounded-2xl px-8 py-4 font-medium`}>
                ออกแบบเอง →
              </Link>
            </div>

            {/* Stats — folded into the hero so the key numbers show without scrolling */}
            <div className="flex max-w-md items-center gap-6">
              {stats.map((s, i) => (
                <div key={s.label} className="flex items-center gap-6">
                  {i > 0 && <span className={`${styles.statDivider} h-8 w-px`} aria-hidden="true" />}
                  <div>
                    <p className="text-lg font-bold text-bone-100">{s.value}</p>
                    <p className="text-xs text-bone-500">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <StackedShirtCards images={heroImages} />
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.featuresSection} py-24`}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-bone-100">ทำไมต้องเลือกเรา</h2>
            <p className="text-lg text-bone-400">ครบทุกอย่างในที่เดียว</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className={`${styles.featureCard} rounded-3xl p-8`}>
                <div className={`${styles.featureIcon} mb-6 flex h-14 w-14 items-center justify-center rounded-2xl`}>
                  <f.icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-bone-100">{f.title}</h3>
                <p className="leading-relaxed text-bone-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.ctaSection} py-24`}>
        <span
          aria-hidden="true"
          className={`${styles.ctaWatermark} pointer-events-none absolute inset-x-0 bottom-0 block translate-y-[30%] select-none whitespace-nowrap text-center font-mono text-[13vw] font-black uppercase leading-none tracking-tighter`}
        >
          ALCHEMIST
        </span>
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <h2 className="mb-6 text-4xl font-bold text-bone-100 md:text-5xl">
            พร้อมสร้างเสื้อ
            <br />
            ในแบบของคุณแล้วหรือยัง?
          </h2>
          <p className="mb-10 text-lg text-bone-400">เริ่มต้นง่ายๆ เพียงไม่กี่ขั้นตอน</p>
          <Link href="/products" className={`${styles.primaryButton} inline-block rounded-2xl px-12 py-4 text-lg font-bold`}>
            <span>เริ่มเลย →</span>
          </Link>
        </div>
      </section>
    </div>
  )
}


function StackedShirtCards({ images }: { images: string[] }) {
  const [order, setOrder] = useState(images.map((_, i) => i))
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [flyingOut, setFlyingOut] = useState<"left" | "right" | null>(null)
  const startX = useRef(0)

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (flyingOut) return
    setDragging(true)
    startX.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    setDragX(e.clientX - startX.current)
  }

  const releaseCard = () => {
    if (!dragging) return
    setDragging(false)

    if (Math.abs(dragX) > SWIPE_THRESHOLD) {
      const direction = dragX > 0 ? "right" : "left"
      setFlyingOut(direction)
      window.setTimeout(() => {
        setOrder((prev) => [...prev.slice(1), prev[0]])
        setDragX(0)
        setFlyingOut(null)
      }, 260)
    } else {
      setDragX(0)
    }
  }

  return (
    <div className={cardStyles.stack}>
      {order.slice(0, MAX_VISIBLE).map((imgIndex, position) => {
        const isTop = position === 0

        let transform = `translateY(${position * 10}px) scale(${1 - position * 0.045}) rotate(${
          position % 2 === 0 ? -position * 1.5 : position * 1.5
        }deg)`
        let opacity = 1

        if (isTop) {
          if (flyingOut) {
            const exitX = flyingOut === "right" ? 420 : -420
            transform = `translateX(${exitX}px) rotate(${flyingOut === "right" ? 24 : -24}deg)`
            opacity = 0
          } else {
            transform = `translateX(${dragX}px) rotate(${dragX / 18}deg)`
          }
        }

        return (
          <div
            key={imgIndex}
            className={`${cardStyles.card} ${isTop ? cardStyles.cardTop : ""}`}
            style={{
              transform,
              opacity,
              transition: isTop && dragging ? "none" : undefined,
              zIndex: order.length - position,
            }}
            onPointerDown={isTop ? handlePointerDown : undefined}
            onPointerMove={isTop ? handlePointerMove : undefined}
            onPointerUp={isTop ? releaseCard : undefined}
            onPointerCancel={isTop ? releaseCard : undefined}
          >
            <Image
              src={images[imgIndex]}
              alt=""
              fill
              className={cardStyles.cardImage}
              draggable={false}
              priority={position === 0}
            />
          </div>
        )
      })}
      <span className={cardStyles.hint} aria-hidden="true">
        ลากเพื่อดูรูปถัดไป
      </span>
    </div>
  )
}