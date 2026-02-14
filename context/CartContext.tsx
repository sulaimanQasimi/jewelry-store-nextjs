'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { toast } from 'react-toastify'

export interface CartItem {
  id?: number
  _id?: number
  productName: string
  type?: string
  gram?: number
  karat?: number
  barcode?: string
  image?: string
  purchasePriceToAfn?: number
  salePrice: number
  saleCurrency: string
}

export interface CartContextValue {
  cart: CartItem[]
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  addToCart: (product: CartItem & { id?: number; _id?: number }, price: number, currency: string) => void
  removeFromCart: (productId: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export const useCart = (): CartContextValue | undefined => {
  const context = useContext(CartContext)
  if (!context) {
    toast.error('داخل پرووایدر استفاده کنید')
  }
  return context
}

const STORAGE_KEY = 'jewelryCart'

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setCart(JSON.parse(saved))
    } catch (e) {
      console.error('Cart rehydrate:', e)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const addToCart: CartContextValue['addToCart'] = (product, price, currency) => {
    const id = product.id ?? product._id
    setCart((prev) => {
      if (prev.some((item) => (item.id ?? item._id) === id)) return prev
      return [
        ...prev,
        {
          ...product,
          id: id,
          salePrice: price,
          saleCurrency: currency
        } as CartItem
      ]
    })
  }

  const removeFromCart: CartContextValue['removeFromCart'] = (productId) => {
    setCart((prev) => prev.filter((item) => (item.id ?? item._id) !== productId))
  }

  const clearCart = () => {
    setCart([])
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY)
  }

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (Number(item.salePrice) || 0), 0)
  }

  const getTotalItems = () => cart.length

  const value: CartContextValue = {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
