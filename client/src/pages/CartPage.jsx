import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { updateCartItem, removeFromCart, clearCart } from '../api/cart'
import { createOrder } from '../api/order'
import axiosInstance from '../utils/axiosInstance'

const CartPage = () => {
  const navigate = useNavigate()
  const { cart, loading, error, loadCart, updateCart } = useCart()
  const [updating, setUpdating] = useState({})
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadCart()
  }, [loadCart])

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      console.log('Quantity cannot be less than 1')
      return
    }

    console.log('Updating quantity for product:', productId, 'to:', newQuantity)
    setUpdating(prev => ({ ...prev, [productId]: true }))
    try {
      const result = await updateCartItem(axiosInstance, productId, newQuantity)
      console.log('Quantity update result:', result)
      if (result && result.cart) {
        updateCart(result.cart)
      } else {
        console.error('Invalid response from updateCartItem:', result)
        alert('Invalid response from server')
      }
    } catch (err) {
      console.error('Failed to update quantity:', err)
      alert(err?.response?.data?.message || 'Failed to update quantity')
    } finally {
      setUpdating(prev => ({ ...prev, [productId]: false }))
    }
  }

  const handleRemoveItem = async (productId) => {
    console.log('Removing product from cart:', productId)
    setUpdating(prev => ({ ...prev, [productId]: true }))
    try {
      const result = await removeFromCart(axiosInstance, productId)
      console.log('Remove item result:', result)
      if (result && result.cart) {
        updateCart(result.cart)
      } else {
        console.error('Invalid response from removeFromCart:', result)
        alert('Invalid response from server')
      }
    } catch (err) {
      console.error('Failed to remove item:', err)
      alert(err?.response?.data?.message || 'Failed to remove item')
    } finally {
      setUpdating(prev => ({ ...prev, [productId]: false }))
    }
  }

  const handleClearCart = async () => {
    setActionLoading(true)
    try {
      const result = await clearCart(axiosInstance)
      updateCart(result.cart)
    } catch (err) {
      console.error('Failed to clear cart:', err)
      alert(err?.response?.data?.message || 'Failed to clear cart')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCheckout = () => {
    // For now, just show an alert. In a real app, this would redirect to checkout
    alert('Checkout functionality will be implemented in the next phase!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Cart</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  const cartItems = cart?.items || []
  const totalPrice = cart?.calculated_total_price || 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4"
          >
            ← Back to Products
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Cart Items ({cartItems.length})</h2>
                    <button
                      onClick={handleClearCart}
                      disabled={actionLoading}
                      className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                    >
                      {actionLoading ? 'Clearing...' : 'Clear Cart'}
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.product_id._id} className="p-6">
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          {item.product_id.image_url ? (
                            <img
                              src={item.product_id.image_url}
                              alt={item.product_id.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                              <div className="text-center text-gray-500">
                                <div className="text-2xl">📦</div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {item.product_id.name}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {item.product_id.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.product_id.condition === 'new' ? 'bg-green-100 text-green-800' :
                              item.product_id.condition === 'used' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {item.product_id.condition?.charAt(0).toUpperCase() + item.product_id.condition?.slice(1)}
                            </span>
                            {item.product_id.category && (
                              <span className="text-xs text-gray-500">
                                {item.product_id.category}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              console.log('Decrease button clicked for product:', item.product_id._id)
                              handleQuantityChange(item.product_id._id, item.quantity - 1)
                            }}
                            disabled={updating[item.product_id._id] || item.quantity <= 1}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">
                            {updating[item.product_id._id] ? '...' : item.quantity}
                          </span>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              console.log('Increase button clicked for product:', item.product_id._id)
                              handleQuantityChange(item.product_id._id, item.quantity + 1)
                            }}
                            disabled={updating[item.product_id._id] || item.quantity >= item.product_id.quantity}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            +
                          </button>
                        </div>

                        {/* Price and Remove */}
                        <div className="flex flex-col items-end space-y-2">
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                              ${(item.product_id.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              ${item.product_id.price} each
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              console.log('Remove button clicked for product:', item.product_id._id)
                              handleRemoveItem(item.product_id._id)
                            }}
                            disabled={updating[item.product_id._id]}
                            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 transition-colors"
                          >
                            {updating[item.product_id._id] ? 'Removing...' : 'Remove'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({cartItems.length})</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-semibold">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate('/')}
                  className="w-full mt-3 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
