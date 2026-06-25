import { create } from "zustand"
import { persist } from "zustand/middleware"
import { CartItem } from "@/types"

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, color: string, size: string) => void
  updateQuantity: (productId: string, color: string, size: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items
        const existing = items.find(
          (i) => i.productId === item.productId && i.color === item.color && i.size === item.size
        )
        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === item.productId && i.color === item.color && i.size === item.size
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          })
        } else {
          set({ items: [...items, item] })
        }
      },

      removeItem: (productId, color, size) => {
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.color === color && i.size === size)
          ),
        })
      },

      updateQuantity: (productId, color, size, quantity) => {
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.color === color && i.size === size
              ? { ...i, quantity }
              : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "cart-storage" }
  )
)