"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getProductById } from "@/lib/firebase/products"
import { useCartStore } from "@/store/cartStore"
import { Product } from "@/types"
import Link from "next/link"

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id as string)
        setProduct(data)
        if (data) {
          setSelectedColor(data.colors[0])
          setSelectedSize(data.sizes[0])
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!product || !selectedColor || !selectedSize) return
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      color: selectedColor,
      size: selectedSize,
      quantity,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-3xl" />
          <div className="flex flex-col gap-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="h-10 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return (
    <div className="text-center py-24">
      <p className="text-gray-500">ไม่พบสินค้า</p>
      <Link href="/products" className="text-black underline mt-4 inline-block">กลับหน้าสินค้า</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-600">หน้าแรก</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gray-600">สินค้า</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-white rounded-3xl aspect-square flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm">
            {product.images[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-9xl">👕</span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mt-3">{product.name}</h1>
              <p className="text-gray-500 mt-2 leading-relaxed">{product.description}</p>
            </div>

            <p className="text-4xl font-bold text-gray-900">฿{product.price.toLocaleString()}</p>

            {/* Colors */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-gray-900">สี</p>
                <p className="text-sm text-gray-400">{selectedColor}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                      selectedColor === color ? "border-black scale-110 shadow-md" : "border-gray-200"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="font-semibold text-gray-900 mb-3">ไซส์</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-xl border font-semibold text-sm transition-all ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="font-semibold text-gray-900 mb-3">จำนวน</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 font-medium text-lg"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 font-medium text-lg"
                >
                  +
                </button>
                <span className="text-sm text-gray-400 ml-2">เหลือ {product.stock} ชิ้น</span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3 mt-2">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all ${
                  added
                    ? "bg-green-500 text-white"
                    : "bg-black text-white hover:bg-gray-800 hover:scale-[1.02]"
                }`}
              >
                {added ? "✓ เพิ่มแล้ว!" : "เพิ่มลงตะกร้า"}
              </button>
              <Link
                href="/cart"
                className="px-6 py-4 rounded-2xl border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ดูตะกร้า
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}