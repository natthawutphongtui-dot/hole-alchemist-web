import Link from "next/link"
import Image from "next/image"
import { Product } from "@/types"

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">👕</div>
          )}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-black text-white text-xs px-3 py-1 rounded-full font-medium">
              ดูรายละเอียด
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
          <p className="text-sm text-gray-400 mt-0.5 truncate">{product.description}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-gray-900">
              ฿{product.price.toLocaleString()}
            </span>
            <div className="flex gap-1">
              {product.colors.slice(0, 4).map((color) => (
                <div
                  key={color}
                  className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}