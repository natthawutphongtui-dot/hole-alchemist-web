"use client"

import { useEffect, useState } from "react"
import { getProducts } from "@/lib/firebase/products"
import ProductCard from "@/components/product/ProductCard"
import { Product } from "@/types"

const categories = ["ทั้งหมด", "basic", "premium", "limited"]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filtered, setFiltered] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
        setFiltered(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    if (activeCategory === "ทั้งหมด") {
      setFiltered(products)
    } else {
      setFiltered(products.filter((p) => p.category === activeCategory))
    }
  }, [activeCategory, products])

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">สินค้าทั้งหมด</h1>
          <p className="text-gray-500">เลือกเสื้อที่ใช่สำหรับคุณ</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-black text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-400 self-center">
            {filtered.length} รายการ
          </span>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-100 rounded mb-3 w-3/4" />
                  <div className="h-5 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">👕</p>
            <p className="text-gray-500 font-medium">ไม่พบสินค้าในหมวดหมู่นี้</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}