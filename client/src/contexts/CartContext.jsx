import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { getCart, getCartCount } from '../api/cart'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadCart = useCallback(async () => {
    setLoading(true)
    try {
        const cartData = await getCart(axiosInstance)
        setCart(cartData)
        setCartCount(cartData.total_items || 0)
        setError(null)
    } catch (err) {
      console.error('Failed to load cart:', err)
      setError(err?.response?.data?.message || 'Failed to load cart')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadCartCount = async () => {
    try {
      const { count } = await getCartCount(axiosInstance)
      setCartCount(count)
    } catch (err) {
      console.error('Failed to load cart count:', err)
    }
  }

  const updateCart = (newCart) => {
    setCart(newCart)
    setCartCount(newCart.total_items || 0)
  }

  const clearCartState = () => {
    setCart(null)
    setCartCount(0)
  }

  useEffect(() => {
    // Load cart count on mount (for cart icon)
    loadCartCount()
  }, [])

  const value = {
    cart,
    cartCount,
    loading,
    error,
    loadCart,
    loadCartCount,
    updateCart,
    clearCartState
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
