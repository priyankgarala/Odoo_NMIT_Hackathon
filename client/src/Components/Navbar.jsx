import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import CartIcon from './CartIcon'
import { 
  Menu, 
  X, 
  User, 
  ShoppingBag, 
  LogOut, 
  Package,
  Heart,
  Settings
} from 'lucide-react'

const Navbar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const { cartCount } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ReMarket</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/products" 
              className="text-gray-600 hover:text-green-600 font-medium transition-colors"
            >
              Products
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/myproducts" 
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors"
                >
                  My Products
                </Link>
                <Link 
                  to="/previous-purchases" 
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors"
                >
                  Orders
                </Link>
              </>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <CartIcon />
            
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  {/* User Profile Dropdown */}
                  <div className="relative group">
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {user?.name || user?.email || 'Profile'}
                      </span>
                    </Button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Profile Settings
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        My Orders
                      </Link>
                      <Link
                        to="/myproducts"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        My Products
                      </Link>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/login')}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => navigate('/register')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/my-products"
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Products
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-600 hover:text-gray-900"
                    onClick={() => {
                      navigate('/login')
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      navigate('/register')
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
