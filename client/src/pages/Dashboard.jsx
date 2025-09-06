import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import { getPublicProducts, searchProducts } from '../api/product'
import SearchAndFilter from '../Components/SearchAndFilter'
import Header from '../Components/Header'
import AddToCartButton from '../Components/AddToCartButton'
// import LoadingSpinner from '../Components/LoadingSpinner'

const Dashboard = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchResult, setSearchResult] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await getPublicProducts(axiosInstance)
      setProducts(data)
      setSearchResult(null) // Clear search results when loading all products
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (filters) => {
    setIsSearching(true)
    setError("")
    try {
      const result = await searchProducts(axiosInstance, filters)
      setSearchResult(result)
      setProducts(result.products || [])
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Search failed')
    } finally {
      setIsSearching(false)
    }
  }

  if (loading) return <div className="p-6">Loading products...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>

  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {searchResult ? 'Search Results' : 'Latest Products'}
        </h1>
        {searchResult && (
          <button
            onClick={loadProducts}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to All Products
          </button>
        )}
      </div>

      {/* Search and Filter Component */}
      <SearchAndFilter onSearch={handleSearch} loading={isSearching} />


      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {searchResult ? 'No products found' : 'No products yet'}
          </h3>
          <p className="text-gray-500">
            {searchResult ? 'Try adjusting your search criteria' : 'Be the first to add a product!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <div 
              key={p._id} 
              className="border rounded-xl p-4 bg-white shadow hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/product/${p._id}`)}
            >
              {/* Product Image */}
              {p.image_url ? (
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                  <img 
                    src={p.image_url} 
                    alt={p.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200" 
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-lg bg-gray-200 flex items-center justify-center mb-4">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-1">📦</div>
                    <p className="text-sm">No Image</p>
                  </div>
                </div>
              )}
              
              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{p.name}</h3>
                {p.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
                )}
                
                {/* Price and Condition */}
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-blue-600">${p.price}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    p.condition === 'new' ? 'bg-green-100 text-green-800' :
                    p.condition === 'used' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {p.condition?.charAt(0).toUpperCase() + p.condition?.slice(1) || 'New'}
                  </span>
                </div>
                
                {/* Category */}
                {p.category && (
                  <p className="text-xs text-gray-500">Category: {p.category}</p>
                )}

                {/* Add to Cart Button */}
                <div className="pt-3">
                  <AddToCartButton 
                    product={p} 
                    className="w-full"
                    disabled={!p.is_active}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* <LoadingSpinner fullscreen text="Loading Products" size={48} thickness={6} color='#10b981' /> */}
      </div>
    </div>
  )
}

export default Dashboard;