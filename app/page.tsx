import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative bg-[#1a1a1a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #ffffff 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 40%)" }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-28 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block bg-white/10 text-white text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-full mb-6">
              Premium T-Shirt
            </span>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              เสื้อยืดที่<br />
              <span className="text-gray-400">ออกแบบเอง</span><br />
              ได้เลย
            </h1>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              เลือกสี เลือกเนื้อผ้า วางโลโก้และข้อความได้เอง<br />
              ดู Preview แบบ 3D ก่อนสั่งซื้อ
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products"
                className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all hover:scale-105">
                ดูสินค้าทั้งหมด
              </Link>
              <Link href="/products"
                className="border border-white/30 text-white px-8 py-4 rounded-2xl font-medium hover:bg-white/10 transition-all">
                ออกแบบเอง →
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center backdrop-blur-sm overflow-hidden">
                <Image src="/collection1.png" alt="collection" width={320} height={320} className="object-cover w-full h-full" />
              </div>
              <div className="absolute -top-3 -right-3 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg">
                NEW ✨
              </div>
              <div className="absolute -bottom-3 -left-3 bg-white/10 backdrop-blur text-white text-xs px-3 py-1.5 rounded-xl border border-white/20">
                Custom Design
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#f9f9f9] py-12 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "500+", label: "ลูกค้าพึงพอใจ" },
              { value: "Cotton 100%", label: "ผ้าคุณภาพดี" },
              { value: "ส่งฟรี", label: "ทั่วประเทศไทย" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">{s.value}</p>
                <p className="text-gray-500 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">ทำไมต้องเลือกเรา</h2>
            <p className="text-gray-500 text-lg">ครบทุกอย่างในที่เดียว</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎨",
                title: "ออกแบบเองได้",
                desc: "วางข้อความ โลโก้ เลือกสีและเนื้อผ้าได้ตามใจ พร้อม Preview แบบ 3D",
              },
              {
                icon: "👕",
                title: "ผ้าคุณภาพพรีเมียม",
                desc: "Cotton 100% เกรด A นุ่ม ระบายอากาศดี สีไม่ตก ทนทานทุกการซัก",
              },
              {
                icon: "🚚",
                title: "จัดส่งรวดเร็ว",
                desc: "ส่งฟรีทั่วไทย ติดตามพัสดุได้แบบ real-time ถึงมือใน 3-5 วัน",
              },
            ].map((f) => (
              <div key={f.title}
                className="group p-8 rounded-3xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#1a1a1a] text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            พร้อมสร้างเสื้อ<br />ในแบบของคุณแล้วหรือยัง?
          </h2>
          <p className="text-gray-400 text-lg mb-10">เริ่มต้นง่ายๆ เพียงไม่กี่ขั้นตอน</p>
          <Link href="/products"
            className="inline-block bg-white text-black px-12 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105">
            เริ่มเลย →
          </Link>
        </div>
      </section>

    </div>
  )
}