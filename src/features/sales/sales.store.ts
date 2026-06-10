import { create } from 'zustand'
import type { CartItem } from './sales.types'

type SalesState = {
  cartItems: CartItem[]
  total: number
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export const useSalesStore = create<SalesState>((set) => ({
  cartItems: [],
  total: 0,
  addItem: (item) =>
    set((state) => {
      const cartItems = [...state.cartItems, item]

      return {
        cartItems,
        total: calculateTotal(cartItems),
      }
    }),
  removeItem: (productId) =>
    set((state) => {
      const cartItems = state.cartItems.filter(
        (item) => item.productId !== productId,
      )

      return {
        cartItems,
        total: calculateTotal(cartItems),
      }
    }),
  clearCart: () =>
    set({
      cartItems: [],
      total: 0,
    }),
}))
