import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import { getPublicProducts, searchProducts } from '../api/product'
import SearchAndFilter from '../Components/SearchAndFilter'
import Header from '../Components/Header'
import AddToCartButton from '../Components/AddToCartButton'
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Give Items a Second Life
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
            Discover quality pre-owned goods and sell your unused items. Sustainable shopping made easy with great deals on second-hand treasures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Shop Pre-Owned
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
              <Search className="mr-2 h-5 w-5" />
              Sell Your Items
            </Button>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              {searchResult ? 'Search Results' : 'Latest Products'}
            </h2>
            {searchResult && (
              <Button
                onClick={loadProducts}
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                ← Back to All Products
              </Button>
            )}
          </div>
          <SearchAndFilter onSearch={handleSearch} loading={isSearching} />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop Pre-Owned Categories</h2>
            <p className="text-xl text-gray-600">Find quality second-hand items across all categories</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Electronics", icon: "📱", color: "blue", count: "150+" },
              { name: "Fashion & Accessories", icon: "👕", color: "pink", count: "200+" },
              { name: "Home & Furniture", icon: "🏠", color: "green", count: "120+" },
              { name: "Sports & Fitness", icon: "⚽", color: "orange", count: "80+" },
              { name: "Books & Media", icon: "📚", color: "purple", count: "300+" },
              { name: "Beauty & Health", icon: "💄", color: "rose", count: "90+" },
              { name: "Toys & Games", icon: "🧸", color: "yellow", count: "110+" },
              { name: "Automotive", icon: "🚗", color: "gray", count: "60+" }
            ].map((category, index) => (
              <Card key={index} className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-400">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-${category.color}-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">{category.count} items</p>
                  <Button variant="ghost" size="sm" className="mt-2 text-blue-600 hover:text-blue-700">
                    Explore
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Pre-Owned?</h2>
            <p className="text-xl text-gray-600">Discover the benefits of second-hand shopping</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">Reduce waste and environmental impact by giving items a second life</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Great Value</h3>
              <p className="text-gray-600">Find quality items at fraction of retail prices with verified condition</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-gray-600">Connect with sellers and buyers in your local community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {searchResult ? 'Search Results' : 'Latest Pre-Owned Items'}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <TrendingUp className="h-4 w-4" />
              <span>New listings daily</span>
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
                {searchResult ? 'No items found' : 'No pre-owned items yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchResult ? 'Try adjusting your search criteria' : 'Be the first to list a pre-owned item!'}
              </p>
              {!searchResult && (
                <Button onClick={() => navigate('/add-product')} className="bg-green-600 hover:bg-green-700">
                  List Your First Item
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
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
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
                          <p className="text-2xl font-bold text-blue-600">${p.price}</p>
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

      {/* Stats Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">15K+</div>
              <p className="text-green-200">Items Resold</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">8K+</div>
              <p className="text-green-200">Active Sellers</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <p className="text-green-200">Satisfaction Rate</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$2M+</div>
              <p className="text-green-200">Money Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ReMarket</h3>
              <p className="text-gray-400 mb-4">
                Your sustainable marketplace for quality pre-owned goods. Give items a second life while saving money and the planet.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                  <Users className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                  <Zap className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Electronics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fashion & Accessories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Home & Furniture</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sports & Fitness</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">Subscribe to get updates on new pre-owned items and deals.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:border-blue-500"
                />
                <Button className="bg-green-600 hover:bg-green-700 rounded-l-none">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ReMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard;