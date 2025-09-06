import React, { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { 
  Star, 
  ArrowRight, 
  ShoppingCart, 
  Search, 
  Heart, 
  TrendingUp,
  Shield,
  Truck,
  Award,
  Users,
  Zap
} from 'lucide-react'
import AddToCartButton from '../Components/AddToCartButton'
import { useNavigate } from 'react-router-dom'
import { getPublicProducts, searchProducts } from '../api/product'
import axiosInstance from '../utils/axiosInstance'
import Header from '../Components/Header'


const ProductPage = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [isSearching, setIsSearching] = useState(false)
    const [error, setError] = useState("")
    const [searchResult, setSearchResult] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = async () => {
        setLoading(true)
        setError("")
        try {
            const data = await getPublicProducts(axiosInstance)
            setProducts(data)
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || 'Failed to load products')
        } finally {
            setLoading(false)
        }
    }
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {searchResult ? 'Search Results' : 'Featured Products'}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <TrendingUp className="h-4 w-4" />
              <span>Updated daily</span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                {searchResult ? 'No products found' : 'No products yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchResult ? 'Try adjusting your search criteria' : 'Be the first to add a product!'}
              </p>
              {!searchResult && (
                <Button onClick={() => navigate('/add-product')} className="bg-green-600 hover:bg-green-700">
                  Add Your First Product
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(p => (
                <Card 
                  key={p._id} 
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:border-blue-200"
                  onClick={() => navigate(`/product/${p._id}`)}
                >
                  <CardContent className="p-0">
                    {/* Product Image */}
                    <div className="relative">
                      {p.image_url ? (
                        <div className="aspect-square rounded-t-lg overflow-hidden bg-gray-100">
                          <img 
                            src={p.image_url} 
                            alt={p.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                        </div>
                      ) : (
                        <div className="aspect-square rounded-t-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <div className="text-4xl mb-2">📦</div>
                            <p className="text-sm">No Image</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Badge */}
                      <Badge className="absolute top-3 left-3 bg-white text-gray-800 shadow-md">
                        {p.condition?.charAt(0).toUpperCase() + p.condition?.slice(1) || 'New'}
                      </Badge>
                      
                      {/* Wishlist Button */}
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="absolute top-3 right-3 bg-white/80 hover:bg-white shadow-md"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Add to wishlist functionality
                        }}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors">
                          {p.name}
                        </h3>
                        {p.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                            {p.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Price and Rating */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-green-600">${p.price}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">(4.0)</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Category */}
                      {p.category && (
                        <Badge variant="outline" className="text-xs">
                          {p.category}
                        </Badge>
                      )}

                      {/* Add to Cart Button */}
                      <div className="pt-2">
                        <AddToCartButton 
                          product={p} 
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          disabled={!p.is_active}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default ProductPage