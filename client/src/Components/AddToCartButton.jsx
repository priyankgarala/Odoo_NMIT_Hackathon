import React, { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { addToCart } from '../api/cart'
import axiosInstance from '../utils/axiosInstance'

const AddToCartButton = ({ product, quantity = 1, className = "", disabled = false }) => {
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)
  const { loadCartCount } = useCart()

  const handleAddToCart = async () => {
    if (!product || !product._id || disabled) return

    setLoading(true)
    try {
      await addToCart(axiosInstance, product._id, quantity)
      setAdded(true)
      await loadCartCount() // Update cart count
      
      // Reset the "added" state after 2 seconds
      setTimeout(() => setAdded(false), 2000)
    } catch (err) {
      console.error('Failed to add to cart:', err)
      alert(err?.response?.data?.message || 'Failed to add item to cart')
    } finally {
      setLoading(false)
    }
  }

  const isDisabled = disabled || !product?.is_active || loading

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={`
        px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
        ${added 
          ? 'bg-green-600 text-white' 
          : isDisabled 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
        }
        ${className}
      `}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Adding...
        </>
      ) : added ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Added to Cart!
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
          Add to Cart
        </>
      )}
    </button>
  )
}

export default AddToCartButton
