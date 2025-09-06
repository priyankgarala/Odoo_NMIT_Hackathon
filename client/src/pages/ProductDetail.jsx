import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import { getPublicProduct } from '../api/product'
import AddToCartButton from '../Components/AddToCartButton'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) {
      setError("Product ID is required")
      setLoading(false)
      return
    }

    getPublicProduct(axiosInstance, id)
      .then(setProduct)
      .catch(err => setError(err?.response?.data?.message || err?.message || 'Failed to load product'))
      .finally(() => setLoading(false))
  }, [id])

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'new':
        return 'bg-green-100 text-green-800'
      case 'used':
        return 'bg-yellow-100 text-yellow-800'
      case 'refurbished':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCondition = (condition) => {
    return condition.charAt(0).toUpperCase() + condition.slice(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Products
          </button>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="space-y-4">
              {product.image_url ? (
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-xl bg-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-2">📦</div>
                    <p className="text-lg">No Image Available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(product.condition)}`}>
                    {formatCondition(product.condition)}
                  </span>
                  {product.category && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      {product.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="border-t pt-6">
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                  {product.quantity > 1 && (
                    <span className="text-lg text-gray-600">
                      (Qty: {product.quantity})
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Product Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {product.category || 'Not specified'}
                    </dd>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Condition</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatCondition(product.condition)}
                    </dd>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Quantity Available</dt>
                    <dd className="mt-1 text-sm text-gray-900">{product.quantity}</dd>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.is_active ? 'Available' : 'Unavailable'}
                      </span>
                    </dd>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-6">
                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate('/')}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Continue Shopping
                  </button>
                  <AddToCartButton 
                    product={product} 
                    className="flex-1 py-3 px-6"
                    disabled={!product.is_active}
                  />
                </div>
                {product.is_active && (
                  <div className="mt-4">
                    <button
                      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Contact Seller
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
