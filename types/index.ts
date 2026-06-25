export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  colors: string[]
  sizes: string[]
  stock: number
  category: string
  createdAt: Date
}

export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  color: string
  size: string
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  totalPrice: number
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled"
  shippingAddress: ShippingAddress
  createdAt: Date
}

export interface ShippingAddress {
  fullName: string
  phone: string
  address: string
  district: string
  province: string
  zipCode: string
}

export interface User {
  id: string
  email: string
  displayName: string
  photoURL?: string
  role: "customer" | "admin"
  createdAt: Date
}